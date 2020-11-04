import Plugin from '@ckeditor/ckeditor5-core/src/plugin'
import Widget from '@ckeditor/ckeditor5-widget/src/widget'
import Command from '@ckeditor/ckeditor5-core/src/command'

import { addListToDropdown, createDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils'
import Collection from '@ckeditor/ckeditor5-utils/src/collection'
import Model from '@ckeditor/ckeditor5-ui/src/model'

export default class Snippet extends Plugin {
  static get requires() {
    return [SnippetEditing, SnippetUI]
  }
}

class SnippetCommand extends Command {
  execute({ value }) {
    const editor = this.editor

    editor.model.change(() => {
      const viewFragment = editor.data.processor.toView(value)
      const modelFragment = editor.data.toModel(viewFragment)
      editor.model.insertContent(modelFragment)
    })
  }

  refresh() {
    this.isEnabled = true
  }
}

class SnippetUI extends Plugin {
  init() {
    const editor = this.editor
    const t = editor.t
    const snippetEntries = editor.config.get('snippetConfig.entries')

    if (snippetEntries && snippetEntries.length) {
      editor.ui.componentFactory.add('snippet', locale => {
        const dropdownView = createDropdown(locale)

        addListToDropdown(dropdownView, getDropdownItemsDefinitions(snippetEntries))

        dropdownView.buttonView.set({
          label: t('Snippets'),
          tooltip: true,
          withText: true,
        })

        const command = editor.commands.get('snippet')
        dropdownView.bind('isEnabled').to(command)

        this.listenTo(dropdownView, 'execute', evt => {
          editor.execute('snippet', { value: evt.source.commandParam.value, name: evt.source.commandParam.name })
          editor.editing.view.focus()
        })

        return dropdownView
      })
    }
  }
}

function getDropdownItemsDefinitions(organisations) {
  const itemDefinitions = new Collection()
  let definition = {}

  const getLabel = (organisation, item) => (organisations.length > 1 ? `${organisation.name} - ${item.name}` : item.name)

  for (const organisation of organisations) {
    for (const item of organisation.items) {
      definition = {
        type: 'button',
        model: new Model({
          commandParam: item,
          label: getLabel(organisation, item),
          withText: true,
        }),
      }
      itemDefinitions.add(definition)
    }
  }
  return itemDefinitions
}

class SnippetEditing extends Plugin {
  static get requires() {
    return [Widget]
  }

  init() {
    this.editor.commands.add('snippet', new SnippetCommand(this.editor))
  }
}
