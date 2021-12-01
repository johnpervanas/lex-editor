import Plugin from '@ckeditor/ckeditor5-core/src/plugin'
import SignatureBoxEditing from './SignatureBoxEditing'
import SignatureBoxUI from './SignatureBoxUI'

export default class SignatureBox extends Plugin {
  static get requires() {
    return [SignatureBoxEditing, SignatureBoxUI]
  }
}
