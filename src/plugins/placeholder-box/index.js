import Plugin from '@ckeditor/ckeditor5-core/src/plugin'
import PlaceholderBoxEditing from './PlaceholderBoxEditing'
import PlaceholderBoxUI from './PlaceholderBoxUI'

export default class PlaceholderBox extends Plugin {
  static get requires() {
    return [PlaceholderBoxEditing, PlaceholderBoxUI]
  }
}
