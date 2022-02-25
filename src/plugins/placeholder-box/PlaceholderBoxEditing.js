import Plugin from '@ckeditor/ckeditor5-core/src/plugin'
import { toWidget, viewToModelPositionOutsideModelElement } from '@ckeditor/ckeditor5-widget/src/utils'
import Widget from '@ckeditor/ckeditor5-widget/src/widget'
import InsertPlaceholderBoxCommand from './InsertPlaceholderBoxCommand'

export default class PlaceholderBoxEditing extends Plugin {
  static get requires() {
    return [Widget]
  }

  init() {
    this._defineSchema()
    this._defineConverters()

    this.editor.commands.add('placeholderBox', new InsertPlaceholderBoxCommand(this.editor))
    this.editor.editing.mapper.on(
      'viewToModelPosition',
      viewToModelPositionOutsideModelElement(this.editor.model, viewElement => viewElement.hasClass('placeholderBox')),
    )
  }

  _defineSchema() {
    const schema = this.editor.model.schema

    schema.register('placeholderBox', {
      allowWhere: '$text',
      isInline: true,
      isObject: true,
      allowAttributes: [
        'name',
        'placeholderId',
        'placeholderName',
        'placeholderType',
        'placeholderLabel',
        'placeholderOptional',
      ],
    })
  }

  _defineConverters() {
    const conversion = this.editor.conversion
    const messages = this.editor.config.get('placeholderBoxConfig.messages')
    let typeDictionary = []
    if (messages && messages.types) {
      typeDictionary = messages.types
    }

    conversion.for('upcast').elementToElement({
      view: {
        name: 'span',
        classes: ['placeholderBox'],
      },
      model: (viewElement, { writer: modelWriter }) => {
        const name = viewElement.getAttribute('name')
        const placeholderName = viewElement.getAttribute('data-placeholdername')
        const placeholderId = viewElement.getAttribute('data-placeholderid')
        const placeholderType = viewElement.getAttribute('data-placeholdertype')
        const placeholderLabel = viewElement.getAttribute('data-placeholderlabel')
        const placeholderOptional = viewElement.getAttribute('data-placeholderoptional')
        return modelWriter.createElement('placeholderBox', {
          name,
          placeholderName,
          placeholderId,
          placeholderLabel,
          placeholderType,
          placeholderOptional,
        })
      },
    })

    conversion.for('editingDowncast').elementToElement({
      model: 'placeholderBox',
      view: (modelItem, { writer: viewWriter }) => {
        const widgetElement = createPlaceholderBoxView(modelItem, viewWriter, typeDictionary)
        return toWidget(widgetElement, viewWriter)
      },
    })

    conversion.for('dataDowncast').elementToElement({
      model: 'placeholderBox',
      view: (modelItem, { writer: viewWriter }) => createPlaceholderBoxView(modelItem, viewWriter, typeDictionary),
    })

    function createPlaceholderBoxView(modelItem, viewWriter, placeholderTypeDictionary) {
      const name = modelItem.getAttribute('name')
      const placeholderId = modelItem.getAttribute('placeholderId')
      const placeholderName = modelItem.getAttribute('placeholderName')
      const placeholderLabel = modelItem.getAttribute('placeholderLabel')
      const placeholderType = modelItem.getAttribute('placeholderType')
      const placeholderOptional = modelItem.getAttribute('placeholderOptional')
      const placeholderBoxView = viewWriter.createContainerElement('span', {
        class: 'placeholderBox',
        'data-placeholderName': placeholderName,
        'data-placeholderId': placeholderId,
        'data-placeholderLabel': placeholderLabel,
        'data-placeholderType': placeholderType,
        ...(placeholderOptional &&
          placeholderOptional !== 'undefined' && { 'data-placeholderOptional': placeholderOptional }),
        name,
      })

      const innerText = viewWriter.createText(
        ' ' +
          placeholderTypeDictionary[placeholderType] +
          ': ' +
          placeholderLabel +
          ' ' +
          (placeholderOptional && placeholderOptional.length ? ' (' + placeholderOptional + ')' : ''),
      )
      viewWriter.insert(viewWriter.createPositionAt(placeholderBoxView, 0), innerText)

      return placeholderBoxView
    }
  }
}
