import Plugin from '@ckeditor/ckeditor5-core/src/plugin'
import { toWidget } from '@ckeditor/ckeditor5-widget/src/utils'
import Widget from '@ckeditor/ckeditor5-widget/src/widget'
import InsertSignatureBoxCommand from './InsertSignatureBoxCommand'

export default class SignatureBoxEditing extends Plugin {
  static get requires() {
    return [Widget]
  }

  init() {
    this._defineSchema()
    this._defineConverters()

    this.editor.commands.add('insertSignatureBox', new InsertSignatureBoxCommand(this.editor))
  }

  _defineSchema() {
    const schema = this.editor.model.schema

    schema.register('signatureBox', {
      isObject: true,
      isSelectable: true,
      allowWhere: '$block',
      allowContentOf: '$block',
    })
  }

  _defineConverters() {
    const conversion = this.editor.conversion

    // <signatureBox> converters
    conversion.for('upcast').elementToElement({
      model: 'signatureBox',
      view: {
        name: 'section',
        classes: 'signature-box',
      },
    })
    conversion.for('dataDowncast').elementToElement({
      model: 'signatureBox',
      view: {
        name: 'section',
        classes: 'signature-box',
      },
    })
    conversion.for('editingDowncast').elementToElement({
      model: 'signatureBox',
      view: (modelElement, { writer: viewWriter }) => {
        const section = viewWriter.createContainerElement('section', { class: 'signature-box' })

        return toWidget(section, viewWriter, { label: 'signature box widget' })
      },
    })
  }
}
