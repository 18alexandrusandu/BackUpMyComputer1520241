// ==UserScript==
// @name        Theming script complex v1
// @namespace   Violentmonkey Scripts
// @match       https://neal.fun/infinite-craft/*
// @grant       none
// @run-at	document-end
// @require 	https://unpkg.com/wanakana
// @require https://raw.githubusercontent.com/surferseo/intl-segmenter-polyfill/master/dist/bundled.js
// @version     1.0
// @author      Alexander_Andercou
// @description 4/29/2024, 7:40:08 AM
// ==/UserScript==
(function() {
var EMOJIS = {}



  function getAvgHex(color, total){
  return Math.round(color / total)
    .toString(16)
    .padStart(2, 0);
  }

function calculatedAverageAndMaxFreqColor(emoji)
   {
      let totalPixels = 0;
      const colors = {
        red: 0,
        green: 0,
        blue: 0,
        alpha: 0
      };
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      ctx.font = "30px Arial";
      ctx.fillStyle = window.getComputedStyle(document.querySelector(".container")).getPropertyValue("--text-color").trim();
      ctx.fillText(emoji, 0, 28);
      var colors2=[];
      var freq=[];

      const { data: imageData } = ctx.getImageData(0, 0, 30, 30);
      for (let i = 0; i < imageData.length; i += 4) {
        let [r, g, b, a] = imageData.slice(i, i + 4);
        if (a > 50) {

            let JColors = JSON.stringify(colors2);
            let JColor=JSON.stringify([r,g,b]);


            if(JColors.indexOf(JColor)>-1)
              {
               let index=0;
                 for(let [rc,gc,bc] of colors2)
                {
                   if(r==rc && g==gc && b==bc)
                    break;
                  index+=1;

                }


                 freq[index]+=1;
              }
               else
             {
                  if(r!=0 || g!=0 || b!=0)
                    {
                   colors2.push([r,g,b]);
                   freq.push(1);
                    }

              }



          totalPixels += 1;
          colors.red += r;
          colors.green += g;
          colors.blue += b;
          colors.alpha += a;
        }
      }
      const r = getAvgHex(colors.red, totalPixels);
      const g = getAvgHex(colors.green, totalPixels);
      const b = getAvgHex(colors.blue, totalPixels);



               console.log(colors2,freq);
               const indexOfLargestValue = freq. reduce((maxIndex, currentValue, currentIndex, array) => currentValue > array[maxIndex] ? currentIndex : maxIndex, 0);
               const secondColor=colors2[indexOfLargestValue];
               console.log(indexOfLargestValue,secondColor);


               return ("linear-gradient(to right ," +"#" + r + g + b +",rgb(" +secondColor[0].toString()+ ","+secondColor[1].toString()+","+secondColor[2].toString()+")) 2");



   }



function uniToEmoji(uni) {

 return String.fromCodePoint(uni);

}
function emojiToUni(emoji) {

  return emoji.codePointAt(0);

}


  function getAverageColor(emoji)
  {

     var code=emojiToUni(emoji);
    if(! (code in EMOJIS))
     {


        EMOJIS[code]=calculatedAverageAndMaxFreqColor(emoji);
        localStorage.setItem("emojiColors",JSON.stringify(EMOJIS));
     }

        console.log("code of emiji", EMOJIS[code]);
        //EMOJIS[code]=correctIfBlack(EMOJIS[code]);


    return  EMOJIS[code];

  }

function doStuffOnMutation(mutations) {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                for (const node of mutation.addedNodes) {

                      if(node.id!="instance-0")
                        {
                               console.log("node:",node);
                               const emojiSpan=node.querySelector(".instance-emoji");
                               const emoji=emojiSpan.textContent;
                               console.log("emoji:",emoji,emojiToUni(emoji));

                               let color=getAverageColor(emoji);



                               node.style.borderImage=color;



                               node.style.borderWidth="2px";
                        }


                    // do stuff
                }
            }
        }
    }

    function initColors() {

          if( localStorage.getItem("emojiColors")!=null)
         {
           EMOJIS=JSON.parse(localStorage.getItem("emojiColors"));
         }

        const instanceObserver = new MutationObserver((mutations) => {
            doStuffOnMutation(mutations);
        });
        instanceObserver.observe(document.getElementsByClassName("instances")[0], {
            childList: true,
            subtree: true,
            // attributes: true
        });
    }

    window.addEventListener('load', async () => {
         console.log("not working");
      EMOJIS={};
      initColors();


        }, false);
})();