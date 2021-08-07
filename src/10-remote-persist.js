import React, { useState, useEffect } from 'react';
import Field from './08-field-component-field'
import isEmail from 'validator/lib/isEmail';

const apiClient = require('./api/client')
const CourseSelect = require('./09-course-select.js');

const INITIAL = {
  fields: {
    name: '',
    email: '',
    course: null,
    department: null
  },
  fieldErrors: {},
  people: [],
  _loading: true,
  _saveStatus: 'READY'
}
const RemotePersist = () => {
  const [ state, setState ] = useState(INITIAL)

  useEffect(() => {
    apiClient.loadPeople().then(people => {
      setState({...state, _loading: false, people });
    });
  }, [])

  const validate = () => {
    const person = state.fields;
    const fieldErrors = state.fieldErrors;
    const errMessages = Object.keys(fieldErrors).filter(k => fieldErrors[k]);

    if (!person.name) return true;
    if (!person.email) return true;
    if (!person.course) return true;
    if (!person.department) return true;
    if (errMessages.length) return true;

    return false;
  };

  const onFormSubmit = async(evt) => {
    const person = state.fields;

    evt.preventDefault();

    if (validate()) return;

    const people = [...state.people, person];
    setState({...state, _saveStatus: 'SAVING'});
    apiClient
      .savePeople(people)
      .then(() => {
        setState({ ...INITIAL, people, _saveStatus: 'SUCCESS' });
        setTimeout(() => {
          window.location.reload(1);
       }, 1000);
      })
      .catch(err => {
        console.error(err);
        setState({...state, _saveStatus: 'ERROR'});
      });
  };

  const onInputChange = ({name, value, error}) => {
    const fields = state.fields;
    const fieldErrors = state.fieldErrors;

    fields[name] = value;
    fieldErrors[name] = error;
    setState({...state, fields, fieldErrors, _saveStatus: 'READY'});
  };

  return (
    <div>
        <h1>Sign Up Sheet</h1>

        <form onSubmit={onFormSubmit}>
          <Field
            placeholder="Name"
            name="name"
            value={state.fields.name}
            onChange={onInputChange}
            validate={val => (val ? false : 'Name Required')}
          />

          <br />

          <Field
            placeholder="Email"
            name="email"
            value={state.fields.email}
            onChange={onInputChange}
            validate={val => (isEmail(val) ? false : 'Invalid Email')}
          />

          <br />

          <CourseSelect
            department={state.fields.department}
            course={state.fields.course}
            onChange={onInputChange}
          />

          <br />

          {
            {
              SAVING: <input value="Saving..." type="submit" disabled />,
              SUCCESS: <input value="Saved!" type="submit" disabled />,
              ERROR: (
                <input
                  value="Save Failed - Retry?"
                  type="submit"
                  disabled={validate()}
                />
              ),
              READY: (
                <input
                  value="Submit"
                  type="submit"
                  disabled={validate()}
                />
              )
            }[state._saveStatus]
          }
        </form>

        <div>
          <h3>People</h3>
          <ul>
            {state.people.map(({name, email, department, course}, i) => (
              <li key={i}>{[name, email, department, course].join(' - ')}</li>
            ))}
          </ul>
        </div>
    </div>
  )
}

export default RemotePersist