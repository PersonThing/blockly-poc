//////////////////////////////////////////////////////////////////////////////
// Code available to eval()
//////////////////////////////////////////////////////////////////////////////
import wtes from './wtes.js';

const tryRunJS = function (code, context) {
  wtes.logs = [];

  try {
    eval(code);
  } catch (e) {
    console.error('Error during generated code execution', e);
  }

  return wtes.logs.reverse();
};

export { tryRunJS };
