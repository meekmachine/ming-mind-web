import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const sample = `
me: Hey, you knocked over my dr ink! You're lucky I don't have any real anger toward you, but I really hate when people knock things over and make a mess!\n
BabyCakes: I'm really mad right now and I want to tell you how I feel. You did something really stupid and I don't really know what to do about it. It's really irritating me and I just want to tell you how I feel.\n
me: Leave my property now! You're not welcome here!\n
BabyCakes: Get your act together, we've been waiting months for this project and now you're not even ready!? Fine, we'll do it ourselves!\n
me: You left me stranded and all I had were the clothes on my back. Now I'm freezing and I don't have anything to eat. You're an ungrateful ass!\n
BabyCakes: I was so mad when I saw that you posted that picture of us online. It's really inappropriate and it's really not like you at all. I don't know what got into you, but I'm really disappointed in you. I hope you can understand why I'm upset and why I don't want to be friends with you anymore. Goodbye.\n
`
function FormPage() {
  const [text, setText] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    // You can pass the text to the ResponsePage using state in navigate
    navigate('/response', { state: { text: text || sample } });
  };

  return (
    <div className="form-wrapper">
      <h1>Claridad.ai</h1>
      <textarea
       
        onChange={(e) => setText(e.target.value)}
        value={sample} 
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default FormPage;
