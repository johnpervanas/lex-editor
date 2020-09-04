import Plugin from '@ckeditor/ckeditor5-core/src/plugin'
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview'
import Notification from '@ckeditor/ckeditor5-ui/src/notification/notification'

import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/pencil.svg'

/**
 * This plugin requires an additional config setting when creating the CKEditor instance,
 * eg.
 *
 * -------------------------------------------------------
 * ClassicEditor .create( document.querySelector( '#editor' ), {
        createPlaceholderConfig: {
          callback: placeholder => { console.log('add new placeholder callback: '  + placeholder)}
        }
  })
 * -------------------------------------------------------
 *
 */
export default class CreatePlaceholder extends Plugin {
  init() {
    const editor = this.editor
    const t = editor.locale.t
    const notification = editor.plugins.get(Notification)

    const createPlaceholderConfig = editor.config.get('createPlaceholderConfig')
    if (createPlaceholderConfig === undefined) {
      console.info(
        'CKEditor/CreatePlaceholder: Missing callback function, please set the createPlaceholderConfig.callback attribute to enable the plugin.',
      )
      return
    }

    editor.ui.componentFactory.add('createPlaceholder', locale => {
      const view = new ButtonView(locale)
      view.set({
        label: 'Create a new placeholder',
        icon: imageIcon,
        tooltip: true,
      })

      // Callback executed once the placeholder button is clicked.
      view.on('execute', () => {
        const placeholderName = prompt('Placeholder name')
        if (placeholderName && placeholderName.length) {
          editor.model.change(async writer => {
            let callbackResult
            try {
              // Trigger the callback function
              callbackResult = await createPlaceholderConfig.callback(placeholderName)
            } catch (e) {
              console.info('CKEditor/CreatePlaceholder: Something went wrong when calling the placeholder callback', e)
              callbackResult = t('Something went wrong, please try again')
            }

            if (callbackResult === 'OK') {
              // Create the placeholder element
              const placeholderElement = writer.createElement('placeholder', {
                name: placeholderName,
              })

              // Insert the placeholder in the current selection location.
              editor.model.insertContent(placeholderElement, editor.model.document.selection)
            } else {
              // throw the notification error
              notification.showWarning(callbackResult, {
                title: t('Placeholder creation failed'),
              })
            }
          })
        }
      })

      return view
    })
  }
}
