import React from "react";
import { useState } from 'react';

import { Button, ButtonGroup, ToggleButton } from "react-bootstrap";
import "./elements-type.css";

const ElementsType = () => {

  const [radioValue, setRadioValue] = useState('');

  const radios = [
    { name: 'Accessoires', value: '1' },
    { name: 'Électroménagers', value: '2' },
    { name: 'Sanitaires', value: '3' },
    { name: 'PDT Solid Surface', value: '4' },
    { name: 'Divers', value: '5' },
  ];


  return (
    <> 
    <div className="btn-wrapper">
      <ButtonGroup>
        {radios.map((radio, idx) => (
          <ToggleButton
            key={idx}
            id={`radio-${idx}`}
            type="radio"
            variant={idx % 2 ? 'outline-dark' : 'outline-danger'}
            name="radio"
            value={radio.value}
            checked={radioValue === radio.value}
            onChange={(e) => setRadioValue(e.currentTarget.value)}
            style={{ margin: '0 20px' }} // Adding margin for spacing
          >
            {radio.name}
          </ToggleButton>
        ))}
        <Button 
          variant="secondary" 
          style={{ marginLeft: '20px' }} // Aligns the button to the right
          onClick={() => setRadioValue('')} // Reset the radioValue
        >
          Reset
        </Button>
      </ButtonGroup>
      </div>
    </>
  );
};

export default ElementsType;
