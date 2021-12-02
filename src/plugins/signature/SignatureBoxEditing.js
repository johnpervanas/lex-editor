import Plugin from '@ckeditor/ckeditor5-core/src/plugin'
import { toWidget, viewToModelPositionOutsideModelElement } from '@ckeditor/ckeditor5-widget/src/utils'
import Widget from '@ckeditor/ckeditor5-widget/src/widget'
import InsertSignatureBoxCommand from './InsertSignatureBoxCommand'

export default class SignatureBoxEditing extends Plugin {
  static get requires() {
    return [Widget]
  }

  init() {
    this._defineSchema()
    this._defineConverters()

    this.editor.commands.add('signatureBox', new InsertSignatureBoxCommand(this.editor))
    this.editor.editing.mapper.on(
      'viewToModelPosition',
      viewToModelPositionOutsideModelElement(this.editor.model, viewElement => viewElement.hasClass('signatureBox')),
    )
  }

  _defineSchema() {
    const schema = this.editor.model.schema

    schema.register('signatureBox', {
      allowWhere: '$text',
      isInline: true,
      isObject: true,

      allowAttributes: ['name', 'signatoryName', 'signatoryId'],
    })
  }

  _defineConverters() {
    const conversion = this.editor.conversion
    const messages = this.editor.config.get('signatureBoxConfig.messages')
    let message = 'Signature:'
    if (messages && messages.container) {
      message = messages.container
    }

    conversion.for('upcast').elementToElement({
      view: {
        name: 'span',
        classes: ['signatureBox'],
      },
      model: (viewElement, { writer: modelWriter }) => {
        const name = viewElement.getAttribute('name')
        const signatoryName = viewElement.getAttribute('data-signatoryname')
        const signatoryId = viewElement.getAttribute('data-signatoryid')
        return modelWriter.createElement('signatureBox', { name, signatoryName, signatoryId })
      },
    })

    conversion.for('editingDowncast').elementToElement({
      model: 'signatureBox',
      view: (modelItem, { writer: viewWriter }) => {
        const widgetElement = createSignatoryBoxViewView(modelItem, viewWriter, message)
        return toWidget(widgetElement, viewWriter)
      },
    })

    conversion.for('dataDowncast').elementToElement({
      model: 'signatureBox',
      view: (modelItem, { writer: viewWriter }) => createSignatoryBoxViewView(modelItem, viewWriter, message),
    })

    function createSignatoryBoxViewView(modelItem, viewWriter, messageCopy) {
      const name = modelItem.getAttribute('name')
      const signatoryId = modelItem.getAttribute('signatoryId')
      const signatoryName = modelItem.getAttribute('signatoryName')
      const signatoryBoxView = viewWriter.createContainerElement('span', {
        class: 'signatureBox',
        'data-signatoryName': signatoryName,
        'data-signatoryId': signatoryId,
        name,
      })

      const innerText = viewWriter.createText(' ____ ' + messageCopy + ': ' + signatoryName + ' ____ ')
      viewWriter.insert(viewWriter.createPositionAt(signatoryBoxView, 0), innerText)

      return signatoryBoxView
    }
  }
}
