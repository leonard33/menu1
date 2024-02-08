import React, { useState } from 'react';
import QRCode from 'qrcode.react';

const Qrgen = () => {

    const [text, setText] = useState('');
  const [qrValue, setQRValue] = useState('');

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const generateQRCode = () => {
    // Change 'yourappurl' to the actual URL of your application
    const appURL = 'https://art-community.netlify.app/';
    const fullText = `${text}\n${appURL}`;
    setQRValue(fullText);
  };

  return (
    <div>
    <h1>QR Code Generator</h1>
    <input
      type="text"
      placeholder="Enter text or URL"
      value={text}
      onChange={handleChange}
    />
    <button onClick={generateQRCode}>Generate QR Code</button>
    <div>
      {qrValue && (
        <QRCode value={qrValue} />
      )}
    </div>
  </div>
  )
}

export default Qrgen
