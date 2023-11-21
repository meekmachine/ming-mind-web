import { useEffect } from 'react';

const useTypingEffect = (onTextTyped: (text: string) => void) => {
  useEffect(() => {

        const fullText: string =    '<h1>Meet Ming!<span class="cursor"></span></h1><p>Ming stands for multi-modal Mediator for Interlocutive Noxiousness and Grievances, and is the work of three graduate students at <a href="https://cis.fiu.edu">The Knight Foundation School of Computing and Information Sciences</a>.</p><p>Our stated goal when starting this project was to "explore the possible uses for generative AI in the role of conflict mediation."</p><p>Our first problem was to find a dataset we could use to test our system. During our search, we were delighted to find The Conversations Gone Awry Corpus.</p><p>The corpus is a collection of arguments between Wikipedia editors, that occurred sometime arround 2017. It is annotated with toxicity scores and personal attacks.</p><p>We liked this dataset so much we created a 3d graph visualizer that shows the argumenmts grouped into topics that can be analyzed.</p><p>...Or just paste or type your own conversation gone awry HERE to get helpful feedback!</p><p>As it turns out, in Chinese the word "ming" means LIGHT, but can also mean CLEAR, perhaps somewhat similar to the english word ELUCIDATE.</p><p>Since, shedding light on difficult arguments is what hoped to achieve with this project, we thought the name Ming was a perfect choice!</p><p>Welcome to the <span style="font-family: Arial, sans-serif; font-size:36px">明🧠</span>!!!</p>'
        let charIndex = 0;
        let typedText = '';
        let tagBuffer = '';
        let isInsideTag = false;
    
        const typeCharacter = () => {
          if (charIndex < fullText.length) {
            const currentChar = fullText[charIndex];
            charIndex++;
    
            if (currentChar === '<') {
              isInsideTag = true;
            } else if (currentChar === '>') {
              isInsideTag = false;
            }
    
            if (isInsideTag) {
              tagBuffer += currentChar;
            } else {
              if (tagBuffer) {
                typedText += tagBuffer + currentChar;
                tagBuffer = '';
              } else {
                typedText += currentChar;
              }
            }
    
            onTextTyped(typedText + tagBuffer);
          }
        };
    
        const typingInterval = setInterval(typeCharacter, 100);
    
        return () => {
          clearInterval(typingInterval);
        };
      }, [onTextTyped]);
    };
    
    export default useTypingEffect;
