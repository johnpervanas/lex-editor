import Command from '@ckeditor/ckeditor5-core/src/command'

export default class InsertSignatureBoxCommand extends Command {
  execute() {
    const messages = this.editor.config.get('signatureBoxConfig.messages')
    let containerMessage = 'Document signature'
    if (messages) {
      if (messages.container) {
        containerMessage = messages.container
      }
    }

    this.editor.model.change(writer => {
      this.editor.model.insertContent(createSignatureBox(writer, containerMessage))
    })
  }

  refresh() {
    const model = this.editor.model
    const selection = model.document.selection
    const allowedIn = model.schema.findAllowedParent(selection.getFirstPosition(), 'signatureBox')

    this.isEnabled = allowedIn !== null
  }
}

function createSignatureBox(writer, containerMessage) {
  const signatureBox = writer.createElement('signatureBox')
  writer.insertText(containerMessage, signatureBox, 'end')

  return signatureBox
}
