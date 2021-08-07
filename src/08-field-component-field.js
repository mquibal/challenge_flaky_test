import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Field = (props) => {
  Field.propTypes = {
    placeholder: PropTypes.string,
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    validate: PropTypes.func,
    onChange: PropTypes.func.isRequired
  };
  
  const [ state, setState ] = useState({
    value:  props.value,
    error: false
  })

  const onChange = evt => {
    const { name, validate } = props;
    const value = evt.target.value;
    const error = validate ? props.validate(value) : false;

    setState({value, error});
    props.onChange({name, value, error});
  };


  return (
    <div>
      <input
        name={props.name}
        placeholder={props.placeholder}
        value={state.value}
        onChange={onChange}
      />
      <span style={{color: 'red'}}>{state.error}</span>
    </div>
  );
}

export default Field



