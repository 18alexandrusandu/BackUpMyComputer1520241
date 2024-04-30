package com.example.bodymonitorbackend.Controllers;

import com.example.bodymonitorbackend.Dtos.*;
import com.example.bodymonitorbackend.Entities.Asignment;
import com.example.bodymonitorbackend.Entities.Note;
import com.example.bodymonitorbackend.Entities.Prescription;
import com.example.bodymonitorbackend.Entities.UserAccount;
import com.example.bodymonitorbackend.Services.UserService;
import org.apache.tomcat.util.json.JSONParser;
import org.hibernate.sql.ast.tree.update.Assignment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*", methods = { RequestMethod.GET,RequestMethod.POST },
        allowedHeaders = "*")
public class UsersController {
    @Autowired
    UserService service;
    @PostMapping("users/loginDevice")
    ResponseEntity<UserDataDto> logFromDevice(@RequestBody  LoginDto loginDto)
   {
       System.out.println("Login entred");
       System.out.println(loginDto.username);
       System.out.println(loginDto.password);


       UserDataDto result=service.logFromDevice(loginDto);
          if(result!=null)
          {
              return  new ResponseEntity<UserDataDto>(result, HttpStatus.OK);
          }

          return new ResponseEntity<UserDataDto>((UserDataDto) null, HttpStatus.BAD_REQUEST);

   }

    @GetMapping("users/assignments/{aid}")
    List<Asignment> getAssignement(@RequestParam("aid") long assistId)
    {
        return service.findAssignments(assistId);
    }
    @GetMapping("users/assign/{uid}/{aid}")
    boolean createAssignement(@PathVariable("uid") Long userId,@PathVariable("aid") Long assistId)
    {
        return service.makeAssignment(userId,assistId);
    }
    @PostMapping("users/signIn")
    ResponseEntity<Boolean> SignInPatient(@RequestBody UserCreateDto createData)
    {
      System.out.println("sign in");

      if( service.SignInPatient(createData))
          return new ResponseEntity<Boolean>(true, HttpStatus.OK);
      else
          return new ResponseEntity<Boolean>(false, HttpStatus.BAD_REQUEST);
    }

    @PostMapping("users/createAdmin")
    ResponseEntity<Boolean>  SignInAdmin(@RequestBody UserCreateDto createData)
    {
        if(service.CreateUserGeneric(createData))
        return new ResponseEntity<Boolean>(true, HttpStatus.OK);
      else
        return new ResponseEntity<Boolean>(false, HttpStatus.BAD_REQUEST);

    }
    @PostMapping("users/createAssistant")
    ResponseEntity<Boolean>  SignInAssistant(@RequestBody UserCreateDto createData)
    {
        if(service.CreateUserGeneric(createData))
            return new ResponseEntity<Boolean>(true, HttpStatus.OK);
        else
            return new ResponseEntity<Boolean>(false, HttpStatus.BAD_REQUEST);
    }
    @PostMapping("users/user/logIn")
    ResponseEntity<UserDataWebDto> loginFromOutside(@RequestBody  LoginDto2 loginDto2)
    {
        UserDataWebDto response=service.loginFromOutside(loginDto2);
        if( response!=null)
            return new ResponseEntity<UserDataWebDto>(response, HttpStatus.OK);
        else
            return new ResponseEntity<UserDataWebDto>((UserDataWebDto) null, HttpStatus.BAD_REQUEST);


    }


    @GetMapping("users/user/{id}")
    ResponseEntity<UserAccount> getUser(@PathVariable(value="id") long userId)
    {

        System.out.println("entered in get date with id:"+userId);
        UserAccount user=service.findUser(userId);
        System.out.println("User:"+user);
        if(user!=null) {

            System.out.println("User found:"+user.username);
            ResponseEntity<UserAccount> result=new ResponseEntity<>(user, HttpStatus.OK);
            System.out.println(result.getStatusCode());
            System.out.println(result.getBody());
            try {
                return result;
            }catch(Exception e)
            {
                System.out.println(e.getMessage());
            }
        }
        return new ResponseEntity<UserAccount>((UserAccount) null, HttpStatus.BAD_REQUEST);

    }

    @GetMapping("users/assignedPatients/{id}")
    List<UserAccount> getAssignedPatients(@PathVariable Long id)
    {
       return service.findAssignedPatients(id);
    }

    @GetMapping("users/allPatients")
    List<UserAccount>  getAllPatients()
    {
        return service.findAllPatients();
    }

    @GetMapping("users/unassignedUsers")
    List<UserAccount> getUnassignedPatients()
    {
        return service.findUnassignedPatients();
    }

    @GetMapping("users/admins")
    List<AdminDataDto> getAdmins()
    {
        return service.findAllAdmins();
    }
    @GetMapping("users/assistants")
    List<UserAccount> getAssistants()
    {
        return service.findAllAssistants();
    }

    @GetMapping("users/assignments")
    List<Asignment> getAllAssignments()
    {
        return service.findAllAssignments();
    }


    @GetMapping("users")
    List<UserAccount> getAllUsers()
    {
        return service.findAllUsers();
    }


    @PostMapping("users/update")
    boolean updateUser(@RequestBody  UserAccount user)
    {
        return service.updateUser(user);
    }




    @GetMapping("users/delete/assignment/{id}")
    boolean deleteAssignment(@PathVariable Long id)
    {

        return service.deleteAssignment(id);
    }





    @PostMapping("users/update/assignment")
    boolean updateAssignment(@RequestBody Asignment assignment)
    {

        return service.updateAssignment(assignment);
    }
    @GetMapping("users/delete/{id}")
    boolean deleteUser(@PathVariable Long id)
    {

        return service.deleteUser(id);
    }
    @GetMapping("users/note/{id}")
    Note getNote(@PathVariable Long id)
    {
        return service.findNote(id);
    }

    @GetMapping("users/prescription/{id}")
    Prescription getPrescription(@PathVariable Long id)
    {
        return service.findPrescription(id);
    }





    @PostMapping("users/note/update")
    boolean updateNote(@RequestBody   NoteDto note)
    {
        return service.updateNote(note);
    }
    @PostMapping("users/note/create")
    boolean createNote(@RequestBody  NoteDto note)
    {
        return service.createNote(note);
    }
    @PostMapping("users/prescription/create")
    boolean createPrescription(@RequestBody  PrescriptionDto prescription)
    {
        return service.createPrescription(prescription);
    }
    @PostMapping("users/prescription/update")
    boolean updatePrescription(@RequestBody  PrescriptionDto prescription)
    {
        return service.updatePrescription(prescription);
    }

    @GetMapping("users/note/delete/{id}")
    boolean deleteNote(@PathVariable Long id)
    {
        return service.deleteNote(id);
    }
    @GetMapping("users/prescription/delete/{id}")
    boolean deletePrescription(@PathVariable  Long id)
    {
        return service.deletePrescription(id);
    }

    @GetMapping("users/changePassword/{username}")
   String sendEmailChangePassword(@PathVariable String username)
    {
      return  service.createAndSendCode( username );

    }
    @GetMapping("users/changePassword/seconsStep/{username}/{code}/{checkcode}")
    UserAccount changePasswordSendUserData(@PathVariable String code,@PathVariable String checkcode,
                                     @PathVariable String username
                                      )
    {
        return  service.sendUserDataForChangePassword( username,code,checkcode);

    }
    @GetMapping("users/changePassword/succesConfirmation/{email}")
    void sendConfirmation(
                                           @PathVariable String email
    )
    {
         service.sendConfirmationEmailForPasswordChange(email);

    }
    @PostMapping("users/changePassword/update")
    void updatePassword(
            @RequestBody UserAccount user
    )
    {
        service.updateUser(user,true);

    }



}
