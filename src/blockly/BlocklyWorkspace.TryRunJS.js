//////////////////////////////////////////////////////////////////////////////
// Code available to eval()
//////////////////////////////////////////////////////////////////////////////
import wtes from './wtes.js';

const tryRunJS = function (code, context) {
  wtes.logs = [];
  console.log(context); // to avoid tree-shaking

  try {
    eval(code);
  } catch (e) {
    console.error('Error during generated code execution', e);
  }

  return wtes.logs.reverse();
};

export { tryRunJS };
