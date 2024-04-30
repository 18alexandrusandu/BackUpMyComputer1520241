package com.example.bodymonitorbackend.Services;

import com.example.bodymonitorbackend.Dtos.*;
import com.example.bodymonitorbackend.Entities.*;
import com.example.bodymonitorbackend.Repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class UserService {
    @Autowired
   public  UserRepository repository;
    @Autowired
    AsignmentRepository asignmentRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    NotesRepository notesRepository;
    @Autowired
    PrescriptionsRepository prescriptionsRepository;

    @Autowired
    EmailService emailService;

    public UserAccount findUser(long id)
      {   if(repository.findById(id).isPresent())

         {
             UserAccount account= repository.findById(id).get();


            account.asignments.sort((Asignment a,Asignment b)->{ return (int)Long.signum(a.priority-b.priority);});
            return account;
        }


          return null;
      }


    public List<UserAccount> findUnassignedPatients()
    {    return repository.findAllByRoleTypeAndAsignmentsIsNull("PATIENT");
    }

    public List<UserAccount> findAssignedPatients(Long assistId)
    {

        System.out.println("find patients assigned to the assistyant with id:"+assistId);


        List<UserAccount> allAssignedPatients= repository.findAllByRoleTypeAndAsignmentsIsNotNull("PATIENT");


        System.out.println("All assigned users"+allAssignedPatients);

        if(allAssignedPatients.size()>0) {
            System.out.println("All assigned users" + allAssignedPatients.get(0).asignments.get(0));
            List<UserAccount> desiredPatients =
                    allAssignedPatients.stream().filter(patient -> patient.
                                    asignments.stream().anyMatch(ass -> ass.asistantId == assistId))
                            .collect(Collectors.toList());
            return desiredPatients;
        }
        return null;
    }
    public List<UserAccount> findAllPatients()
    {
        return repository.findAllByRoleType("PATIENT");
    }

    public List<AdminDataDto> findAllAdmins()
    {
        List<UserAccount> users= repository.findAllByRoleType("ADMIN");
        List<AdminDataDto> admins=new ArrayList<>();
         for(UserAccount user :users)
         {   AdminDataDto admin=new AdminDataDto();
              admin.name=user.name;
              admin.email=user.email;
              admin.phone=user.phone;
              admin.status=user.status;
              admins.add(admin);
         }



      return admins;

    }





     public boolean  makeAssignment(Long Patientid,Long Assistantid)
     {

         Asignment newAssignment=new  Asignment();

         if(repository.findById(Patientid).isPresent()) {
             UserAccount user = repository.findById(Patientid).get();
             if (repository.findById(Assistantid).isPresent()) {
                 System.out.println("All users are ok");
                 UserAccount assistant = repository.findById(Assistantid).get();
                 newAssignment.patientId=user.id;
                 newAssignment.asistantId=assistant.id;
                 newAssignment.priority=0;


                 Asignment savedAssignment= asignmentRepository.save(newAssignment);

                 user.asignments.add(savedAssignment);
                 repository.save(user);

                 return  savedAssignment.id!=null;


             }
         }

       return false;

     }

    public List<Asignment> findAssignments(Long assisgnid)
    {    List<Asignment> Assignments=asignmentRepository.findAllByAsistantId(assisgnid);
        Assignments.sort((Asignment a,Asignment b)->{ return (int)Long.signum(b.priority-a.priority);});
        return Assignments;


    }
    public List<Asignment> findAllAssignments()
    {
        List<Asignment> Assignments=(List<Asignment>) asignmentRepository.findAll();


        return  Assignments;

    }
    public List<UserAccount> findAllAssistants()
    {
        return repository.findAllByRoleType("ASSISTANT");

    }




   public boolean SignInPatient(UserCreateDto userData)
   {
       if(repository.findUserAccountByUsername(userData.username).isEmpty()) {
           UserAccount newUserAccount = new UserAccount();
           newUserAccount.password = encodePassword(userData.password);
           newUserAccount.email = userData.email;


           newUserAccount.username = userData.username;
           newUserAccount.name = userData.name;
           newUserAccount.dateOfBirth = userData.dateOfBirth;
           newUserAccount.role = new Role();
           newUserAccount.role.type = "PATIENT";
           roleRepository.save(newUserAccount.role);
           newUserAccount.phone = userData.phone;
           newUserAccount.address = userData.address;

           UserAccount savedUserAccount = repository.save(newUserAccount);
           if(savedUserAccount.id != null)
           {
               if(  newUserAccount.email !=null)
               {
                   sendEmail( newUserAccount.email,
                           "New user "+  newUserAccount.username +" has sign in as patient in the web application for body mibtoring .\n"
                                   + "If this was not your action please reply to  this message and an administrator will respond back",
                           "Sign in confirmation for Iot body monitoring web application");


               }
               return true;
           }
           return false;
       }
        return false;
   }



     public boolean CreateUserGeneric(UserCreateDto userData)
    {

        if(repository.findUserAccountByUsername(userData.username).isEmpty()) {
            UserAccount newUserAccount = new UserAccount();
            newUserAccount.password = encodePassword(userData.password);
            newUserAccount.email = userData.email;
            newUserAccount.username = userData.username;
            newUserAccount.name = userData.name;
            newUserAccount.dateOfBirth = userData.dateOfBirth;
            newUserAccount.phone = userData.phone;
            newUserAccount.address = userData.address;
            newUserAccount.role = new Role();
            newUserAccount.role.type = userData.RoleType;
            roleRepository.save(newUserAccount.role);

            UserAccount savedUserAccount = repository.save(newUserAccount);
            if(savedUserAccount.id != null)
            {
                if(  newUserAccount.email !=null)
                {
                    sendEmail( newUserAccount.email,
                            "New user "+  newUserAccount.username +" has sign in as"+newUserAccount.role.type
                            +" in the web application for body mibtoring .\n"
                                    + "If this was not your action please reply to  this message and an administrator will respond back",
                            "Creation of account comfirmation for Iot body monitoring web application");


                }
                return true;
            }
        }
        return false;

    }


    public  UserDataDto logFromDevice(LoginDto dto) {
         UserAccount user=null;
         if (!dto.methodFingerPrint) {
             if (repository.findUserAccountByUsername(dto.username).isPresent()) {

                 user = repository.findUserAccountByUsername(dto.username).get();

                 if(!encodePassword(dto.password).equals(user.password)) {
                     return null;
                 }

             } else
                 return null;
         }
           else {
             if (repository.findUserAccountByFingerId(dto.finger_id).isPresent()) {

                user = repository.findUserAccountByFingerId(dto.finger_id).get();

             } else
                 return null;
         }
             UserDataDto userData=new  UserDataDto();
             userData.userId=user.id;
             userData.name=user.name;
             userData.type=user.role.type;
             userData.sensors=new ArrayList<SensorDto>();
             for(int i=0;i<user.sensors.size();i++)
             {
                 SensorDto sensorDto =new  SensorDto();
                 sensorDto.id=user.sensors.get(i).id;
                 sensorDto.type=user.sensors.get(i).type;
                 sensorDto.name=user.sensors.get(i).name;
                 userData.sensors.add(sensorDto);
             }
             return userData;

    }
    String encodePassword(String input)
    {
        try {
            MessageDigest digest= MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));

             StringBuilder stringBuilder = new StringBuilder();
            for (byte b : hash) {
                final String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1)
                    stringBuilder.append('0');
                stringBuilder.append(hex);
            }


             System.out.println("password encoded");
             return stringBuilder.toString();

        } catch (Exception e) {
           System.out.println(e.getMessage() + "Parola ne-codificata");
        }

         return input;
    }





   public UserDataWebDto loginFromOutside(LoginDto2 login)
    {     System.out.println("got in service with username:"+login.username);
        if(repository.findUserAccountByUsername(login.username).isPresent()) {
              UserAccount account=repository.findUserAccountByUsername(login.username).get();
            System.out.println("passed by username");
            if(encodePassword(login.password).equals(account.password))
            {
                System.out.println("found with id:"+ account.id);
                UserDataWebDto data=new UserDataWebDto();
                data.userId= account.id;
                data.name=account.name;
                data.type=account.role.type;

                if(  account.email !=null)
                {
                    sendEmail( account.email,
                            "User with username "+  account.username +" haslogged in as"+account.role.type
                                    +" in the web application for body mibtoring .\n"
                                    + "If this was not your action please reply to  this message and an administrator will respond back",
                            "Login comfirmation for Iot body monitoring web application");
                }


                return data;
            }

            return null;
        }
        return null;
    }
    public  List<UserAccount> findAllUsers()
    {
        return (List<UserAccount>) repository.findAll();
    }


    public boolean deleteAssignment(Long Id)
    {     System.out.println("Id1:"+Id);
        if(asignmentRepository.findById(Id).isPresent()) {

            Asignment asignment = asignmentRepository.findById(Id).get();
            if(repository.findById(asignment .patientId).isPresent()) {
                UserAccount patient = repository.findById(asignment.patientId).get();
                if(repository.findById(asignment .asistantId).isPresent()) {
                    UserAccount asistant = repository.findById(asignment.asistantId).get();
                    asistant.asignments.removeIf(a->a.id.equals(asignment.id));
                    patient.asignments.removeIf(a->a.id.equals(asignment.id));
                    asistant=repository.save(asistant);
                    patient=repository.save(patient);
                    asignmentRepository.delete(asignment);
                     return true;
                }
            }
        }
        return false;
    }
    public boolean updateAssignment(Asignment data)
    {     
        if(asignmentRepository.findById(data.id).isPresent()) {

            Asignment asignment = asignmentRepository.findById(data.id).get();

            Long BeforepatientId=asignment.patientId;
           asignment.patientId=data.patientId;


           asignment.asistantId=data.asistantId;
           asignment.priority=data.priority;

            if(repository.findById(asignment .patientId).isPresent()) {
                UserAccount patient = repository.findById(asignment.patientId).get();
                if(repository.findById(asignment .asistantId).isPresent()) {
                    UserAccount asistant = repository.findById(asignment.asistantId).get();

                    asignment=(asignmentRepository.save(asignment));


                     if(!BeforepatientId.equals(asignment.patientId)) {
                         if (repository.findById(BeforepatientId).isPresent()) {
                             UserAccount FormerPatient = repository.findById(BeforepatientId).get();
                             Long asigmentId=asignment.id;
                             FormerPatient.asignments.removeIf(a -> a.id.equals(asigmentId));
                             FormerPatient=repository.save(FormerPatient);
                             patient.asignments.add(asignment);
                             patient=repository.save(patient);
                         }
                     }else
                     {
                         patient=repository.save(patient);
                     }



                    asistant=repository.save(asistant);

                    asignmentRepository.save(asignment);
                    return true;
                }
            }
        }
        return false;
    }



    public  boolean updateUser(UserAccount user)
    {
          if(repository.findById(user.id).isPresent()) {
              UserAccount account = repository.findById(user.id).get();
              if(user.name!=null)
                  account.name= user.name;
              if(user.username!=null)
                  account.username= user.username;
               if(user.dateOfBirth!=null)
                   account.dateOfBirth= user.dateOfBirth;
              if(user.status!=null)
                  account.status=user.status;
              if(user.address!=null)
               account.address= user.address;;

              if(user.phone!=null)
               account.phone= user.phone;
              if(user.email!=null)
                  account.email= user.email;

              repository.save(account);
              return true;
          }

   return false;

    }
    public  boolean updateUser(UserAccount user,boolean password)
    {
        if(repository.findById(user.id).isPresent()) {
            UserAccount account = repository.findById(user.id).get();
            account.password=encodePassword(user.password);
            repository.save(account);
            return true;
        }

        return false;

    }


   public boolean deleteUser(Long userId )
    {
        if(repository.findById( userId).isPresent()) {
        UserAccount account = repository.findById (userId).get();
            account.asignments.clear();
            account.sensors.clear();

             List<Note> notes=account.notes;
             List<Prescription> prescriptions=account.prescriptions;


            for(Note n : account.notes)
            {
                n.user=null;
                notesRepository.save(n);
            }
            account.notes.clear();
            account.prescriptions.clear();
            Role role=account.role;
            account.role=null;
            repository.save(account);
            notesRepository.deleteAll(notes);
            prescriptionsRepository.deleteAll(prescriptions);
            roleRepository.delete(role);



        repository.deleteById(userId);



        return true;
       };
        return false;
    }


    public boolean createPrescription(PrescriptionDto prescription) {
        Prescription newPrescription=new Prescription();
        newPrescription.description=prescription.description;
        newPrescription.endDate=prescription.end;
        newPrescription.startDate=prescription.start;
        newPrescription.text=prescription.text;
         if(repository.findById(prescription.userId).isPresent()) {
             newPrescription.user = repository.findById(prescription.userId).get();
             newPrescription.user.prescriptions.add(newPrescription);
             repository.save(newPrescription.user);
             prescriptionsRepository.save(newPrescription);
           return true;

         }
        return false;
    }
    public boolean createNote(NoteDto note) {
        Note newNote=new Note();
        newNote.description=note.description;
        newNote.date=note.date;
        newNote.text=note.text;
        if(repository.findById(note.userId).isPresent()) {
            newNote.user = repository.findById(note.userId).get();
            newNote.user.notes.add(newNote);
            repository.save(newNote.user);
            notesRepository.save(newNote);
                  return true;

        }
        return false;
    }

    public boolean deleteNote(Long id) {
        if (notesRepository.findById(id).isPresent()) {
            Note newNote = notesRepository.findById(id).get();
            newNote.user.notes.remove(newNote);
            repository.save(newNote.user);
            newNote.user=null;
            notesRepository.delete(newNote);
            return true;

        }
        return false;
    }

    public boolean deletePrescription(Long id) {
        if (prescriptionsRepository.findById(id).isPresent()) {
            Prescription newPrescription = prescriptionsRepository.findById(id).get();
            newPrescription.user.prescriptions.remove(newPrescription);
            repository.save(newPrescription.user);
            prescriptionsRepository.delete(newPrescription);


           return true;

        }
      return false;
    }

    public boolean updatePrescription(PrescriptionDto prescription) {
        if (prescriptionsRepository.findById(prescription.id).isPresent()) {
            Prescription newPrescription = prescriptionsRepository.findById(prescription.id).get();
            newPrescription.description = prescription.description;
            newPrescription.endDate = prescription.end;
            newPrescription.startDate = prescription.start;
            newPrescription.text = prescription.text;
            if (repository.findById(prescription.userId).isPresent()) {
                newPrescription.user = repository.findById(prescription.userId).get();
                prescriptionsRepository.save(newPrescription);
                return true;

            }
        }
        return false;
    }

    public boolean updateNote(NoteDto note) {
        if (notesRepository.findById(note.Id).isPresent()) {
            Note newNote = notesRepository.findById(note.Id).get();
            newNote.description = note.description;
            newNote.date = note.date;
            newNote.text = note.text;
            if (repository.findById(note.userId).isPresent()) {
                newNote.user = repository.findById(note.userId).get();
                repository.save(newNote.user);
                notesRepository.save(newNote);
                return true;
            }

        }
    return false;
    }

    public Note findNote(Long id) {
        if(notesRepository.findById(id).isPresent())
           return notesRepository.findById(id).get();
        return null;
    }

    public Prescription findPrescription(Long id) {
        if(prescriptionsRepository.findById(id).isPresent())
          return prescriptionsRepository.findById(id).get();
        return null;
    }

    public String createAndSendCode(String username) {
                 System.out.println("change password sending email");
         if(repository.findUserAccountByUsername(username).isPresent())
         {
            UserAccount user=repository.findUserAccountByUsername(username).get();

         String code="";
         StringBuilder builder=new    StringBuilder();
        for(int i=0;i<=8;i++)
        {
            builder.append((char)('0'+(int)(Math.random()*10)));
        }
        code=builder.toString();
             System.out.println("the code is:"+code);
        if(emailService.sendMail("You requested to change your password here is your code:"+code,
                 user.email,
                "Password change for body monitoring application"

                )!=null)
        {
            return code;
        }
           else
            throw  new RuntimeException("Username or Email Not found ");

         }



  return null;


    }

    public UserAccount sendUserDataForChangePassword(String username, String code, String checkcode) {
        if (Objects.equals(code, checkcode) && code.length() == 9 && code.matches("[0-9]+")) {
            if (repository.findUserAccountByUsername(username).isPresent()) {
                return repository.findUserAccountByUsername(username).get();

            }


        }
        return null;
    }

    public void sendEmail(String email,String message,String subject) {
        if (repository.findFirstByEmail(email).isPresent()) {
            UserAccount user = repository.findFirstByEmail(email).get();

             emailService.sendMail(message,email,subject);

        }



    }
    public void sendConfirmationEmailForPasswordChange(String email) {
        if (repository.findFirstByEmail(email).isPresent()) {
            UserAccount user = repository.findFirstByEmail(email).get();

            emailService.sendMail("Password for user "+user.username +" has been changed succesfully , if it was " +
                    "not yoir action please reply to this message",email,
                    "Password changed for body monitoring web application");

        }



    }





}

