// idea taken from https://github.com/ens-lg4/MenulyJSON/

// docs/example for extending a Blockly Field type:
// https://developers.google.com/blockly/guides/create-custom-blocks/fields/customizing-fields/extending

import * as Blockly from 'blockly/core';

export class FieldTextButton extends Blockly.Field {
  constructor(buttontext, changeHandler) {
    super(buttontext);

    this.buttontext_ = buttontext;
    this.changeHandler_ = changeHandler;
  }

  clone() {
    return new FieldTextButton(this.buttontext_, this.changeHandler_);
  }

  // The mouse cursor style when over the hotspot that initiates the editor.
  CURSOR = 'default';

  showEditor_() {
    if (this.changeHandler_) {
      this.changeHandler_();
    }
  }
}

Blockly.fieldRegistry.register('field_textbutton', FieldTextButton);
