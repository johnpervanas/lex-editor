import Plugin from '@ckeditor/ckeditor5-core/src/plugin'
import { toWidget, viewToModelPositionOutsideModelElement } from '@ckeditor/ckeditor5-widget/src/utils'
import Widget from '@ckeditor/ckeditor5-widget/src/widget'
import Command from '@ckeditor/ckeditor5-core/src/command'

import { addListToDropdown, createDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils'
import Collection from '@ckeditor/ckeditor5-utils/src/collection'
import Model from '@ckeditor/ckeditor5-ui/src/model'

export default class Placeholder extends Plugin {
  static get requires() {
    return [PlaceholderEditing, PlaceholderUI]
  }
}

class PlaceholderCommand extends Command {
  execute({ value }) {
    const editor = this.editor

    editor.model.change(writer => {
      const placeholder = writer.createElement('placeholder', { name: value })
      editor.model.insertContent(placeholder)
      writer.setSelection(placeholder, 'on')
    })
  }

  refresh() {
    const model = this.editor.model
    this.isEnabled = model.schema.checkChild(model.document.selection.focus.parent, 'placeholder')
  }
}

class PlaceholderUI extends Plugin {
  init() {
    const editor = this.editor
    const t = editor.t
    const placeholderNames = editor.config.get('placeholderConfig.types')

    if (placeholderNames && placeholderNames.length) {
      editor.ui.componentFactory.add('placeholder', locale => {
        const dropdownView = createDropdown(locale)

        addListToDropdown(dropdownView, getDropdownItemsDefinitions(placeholderNames))

        dropdownView.buttonView.set({
          label: t('Placeholders'),
          tooltip: true,
          withText: true,
        })

        // Disable the placeholder button when the command is disabled.
        const command = editor.commands.get('placeholder')
        dropdownView.bind('isEnabled').to(command)

        // Execute the command when the dropdown item is clicked (executed).
        this.listenTo(dropdownView, 'execute', evt => {
          editor.execute('placeholder', { value: evt.source.commandParam })
          editor.editing.view.focus()
        })

        return dropdownView
      })
    }
  }
}

function getDropdownItemsDefinitions(placeholderNames) {
  const itemDefinitions = new Collection()

  for (const name of placeholderNames) {
    const definition = {
      type: 'button',
      model: new Model({
        commandParam: name,
        label: name,
        withText: true,
      }),
    }

    itemDefinitions.add(definition)
  }

  return itemDefinitions
}

class PlaceholderEditing extends Plugin {
  static get requires() {
    return [Widget]
  }

  init() {
    this._defineSchema()
    this._defineConverters()

    this.editor.commands.add('placeholder', new PlaceholderCommand(this.editor))
    this.editor.editing.mapper.on(
      'viewToModelPosition',
      viewToModelPositionOutsideModelElement(this.editor.model, viewElement => viewElement.hasClass('placeholder')),
    )
  }

  _defineSchema() {
    const schema = this.editor.model.schema

    schema.register('placeholder', {
      allowWhere: '$text',
      isInline: true,
      isObject: true,

      // name refers to the placeholder name, value refers to the placeholder value (not in use yet)
      allowAttributes: ['name', 'value'],
    })
  }

  _defineConverters() {
    const conversion = this.editor.conversion

    conversion.for('upcast').elementToElement({
      view: {
        name: 'span',
        classes: ['placeholder'],
      },
      model: (viewElement, { writer: modelWriter }) => {
        const name = viewElement.getChild(0).data.slice(2, -2)
        return modelWriter.createElement('placeholder', { name })
      },
    })

    conversion.for('editingDowncast').elementToElement({
      model: 'placeholder',
      view: (modelItem, { writer: viewWriter }) => {
        const widgetElement = createPlaceholderView(modelItem, viewWriter)
        return toWidget(widgetElement, viewWriter)
      },
    })

    conversion.for('dataDowncast').elementToElement({
      model: 'placeholder',
      view: (modelItem, { writer: viewWriter }) => createPlaceholderView(modelItem, viewWriter),
    })

    function createPlaceholderView(modelItem, viewWriter) {
      const name = modelItem.getAttribute('name')
      const placeholderView = viewWriter.createContainerElement('span', {
        class: 'placeholder',
      })

      // Insert the placeholder name (as a text).
      const innerText = viewWriter.createText('{{' + name + '}}')
      viewWriter.insert(viewWriter.createPositionAt(placeholderView, 0), innerText)

      return placeholderView
    }
  }
}
