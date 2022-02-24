import Plugin from '@ckeditor/ckeditor5-core/src/plugin'

import { addListToDropdown, createDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils'
import Collection from '@ckeditor/ckeditor5-utils/src/collection'
import Model from '@ckeditor/ckeditor5-ui/src/model'

export default class PlaceholderBoxUI extends Plugin {
  init() {
    const editor = this.editor
    const t = editor.t
    const config = editor.config.get('placeholderBoxConfig')

    if (config && config.placeholders) {
      const definedPlaceholders = config.placeholders

      if (definedPlaceholders && definedPlaceholders.length) {
        editor.ui.componentFactory.add('placeholderBox', locale => {
          const dropdownView = createDropdown(locale)

          addListToDropdown(dropdownView, getDropdownItemsDefinitions(definedPlaceholders))

          dropdownView.buttonView.set({
            label: t('Placeholder box'),
            tooltip: true,
            withText: true,
          })

          // Disable the placeholder button when the command is disabled.
          const command = editor.commands.get('placeholderBox')
          dropdownView.bind('isEnabled').to(command)

          // Execute the command when the dropdown item is clicked (executed).
          this.listenTo(dropdownView, 'execute', evt => {
            console.log('evt-source', evt.source)
            editor.execute('placeholderBox', {
              value: 'placeholder',
              placeholderId: evt.source.placeholderId,
              placeholderLabel: evt.source.placeholderLabel,
              placeholderName: evt.source.placeholderName,
              placeholderType: evt.source.placeholderType,
              placeholderOptional: evt.source.placeholderOptional,
            })
            editor.editing.view.focus()
          })

          return dropdownView
        })
      }
    }
  }
}

function getDropdownItemsDefinitions(placeholders) {
  const itemDefinitions = new Collection()

  placeholders.forEach(i => {
    const definition = {
      type: 'button',
      model: new Model({
        label: i.label,
        commandParam: i.id,
        placeholderId: i.id,
        placeholderLabel: i.label,
        placeholderName: i.name,
        placeholderType: i.type,
        placeholderOptional: i.optional,
        withText: true,
      }),
    }

    itemDefinitions.add(definition)
  })

  return itemDefinitions
}
