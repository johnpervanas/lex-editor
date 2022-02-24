import Command from '@ckeditor/ckeditor5-core/src/command'

export default class InsertPlaceholderBoxCommand extends Command {
  execute({ placeholderType, placeholderId, placeholderName, placeholderLabel, placeholderOptional }) {
    const editor = this.editor

    editor.model.change(writer => {
      const placeholder = writer.createElement('placeholderBox', {
        name: 'placeholder',
        placeholderType,
        placeholderId,
        placeholderLabel,
        placeholderName,
        placeholderOptional,
      })
      editor.model.insertContent(placeholder)
      writer.setSelection(placeholder, 'on')
    })
  }

  refresh() {
    const model = this.editor.model
    this.isEnabled = model.schema.checkChild(model.document.selection.focus.parent, 'placeholderBox')
  }
}
