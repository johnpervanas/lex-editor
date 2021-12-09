import Plugin from '@ckeditor/ckeditor5-core/src/plugin'

import { addListToDropdown, createDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils'
import Collection from '@ckeditor/ckeditor5-utils/src/collection'
import Model from '@ckeditor/ckeditor5-ui/src/model'

export default class SignatureBoxUI extends Plugin {
  init() {
    const editor = this.editor
    const t = editor.t
    const config = editor.config.get('signatureBoxConfig')

    if (config && config.signatories) {
      const signatories = config.signatories

      if (signatories && signatories.length) {
        editor.ui.componentFactory.add('signatureBox', locale => {
          const dropdownView = createDropdown(locale)

          addListToDropdown(dropdownView, getDropdownItemsDefinitions(signatories))

          dropdownView.buttonView.set({
            label: t('Signatory box'),
            tooltip: true,
            withText: true,
          })

          // Disable the placeholder button when the command is disabled.
          const command = editor.commands.get('signatureBox')
          dropdownView.bind('isEnabled').to(command)

          // Execute the command when the dropdown item is clicked (executed).
          this.listenTo(dropdownView, 'execute', evt => {
            editor.execute('signatureBox', {
              value: 'signature',
              signatoryId: evt.source.commandParam,
              signatoryName: evt.source.label,
            })
            editor.editing.view.focus()
          })

          return dropdownView
        })
      }
    }
  }
}

function getDropdownItemsDefinitions(signatories) {
  const itemDefinitions = new Collection()

  signatories.forEach(i => {
    const definition = {
      type: 'button',
      model: new Model({
        commandParam: i.id,
        label: i.name,
        withText: true,
      }),
    }

    itemDefinitions.add(definition)
  })

  return itemDefinitions
}
