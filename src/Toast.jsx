import React from 'react';
import { Toast as BaseToast } from 'react-bootstrap';

export default function Toast(props) {
  const {
    toastType, toastMessage, className, ...newProps
  } = props;
  const newClassName = `${className || ''} bg-${toastType}`;
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <BaseToast {...newProps} className={newClassName}>
      <BaseToast.Header>
        <strong className="mr-auto">{toastType}</strong>
        <small>just now</small>
      </BaseToast.Header>
      <BaseToast.Body>{toastMessage}</BaseToast.Body>
    </BaseToast>
  );
}
