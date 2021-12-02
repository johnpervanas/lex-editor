import Command from '@ckeditor/ckeditor5-core/src/command'

export default class InsertSignatureBoxCommand extends Command {
  execute({ signatoryName, signatoryId }) {
    const editor = this.editor

    editor.model.change(writer => {
      const signature = writer.createElement('signatureBox', { name: 'signature', signatoryId, signatoryName })
      editor.model.insertContent(signature)
      writer.setSelection(signature, 'on')
    })
  }

  refresh() {
    const model = this.editor.model
    this.isEnabled = model.schema.checkChild(model.document.selection.focus.parent, 'signatureBox')
  }
}
