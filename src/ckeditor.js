import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor'

import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials'
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment'
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat'
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold'
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic'
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote'
import CKFinder from '@ckeditor/ckeditor5-ckfinder/src/ckfinder'
import EasyImage from '@ckeditor/ckeditor5-easy-image/src/easyimage'
import Font from '@ckeditor/ckeditor5-font/src/font'
import Heading from '@ckeditor/ckeditor5-heading/src/heading'
import Indent from '@ckeditor/ckeditor5-indent/src/indent'
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize'
import Link from '@ckeditor/ckeditor5-link/src/link'
import PageBreak from '@ckeditor/ckeditor5-page-break/src/pagebreak'
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed'
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph'
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice'
import Table from '@ckeditor/ckeditor5-table/src/table'
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar'
import TableProperties from '@ckeditor/ckeditor5-table/src/tableproperties'
import TableCellProperties from '@ckeditor/ckeditor5-table/src/tablecellproperties'

import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation'
import Snippet from './plugins/snippet'
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline'
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough'
import CKFinderUploadAdapter from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter'
import { Image, ImageUpload } from '@ckeditor/ckeditor5-image'
import { CloudServices } from '@ckeditor/ckeditor5-cloud-services'
import SimpleUploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter'
import ContentModal from './plugins/content-modal'
import PlaceholderBox from './plugins/placeholder-box'
import Highlight from '@ckeditor/ckeditor5-highlight/src/highlight'
import List from './plugins/ckeditor5-list/src/list'
import ListProperties from './plugins/ckeditor5-list/src/listproperties'

export default class ClassicEditor extends ClassicEditorBase {}

// Plugins to include in the build.
ClassicEditor.builtinPlugins = [
  Essentials,
  Autoformat,
  Bold,
  Italic,
  BlockQuote,
  CKFinder,
  CKFinderUploadAdapter,
  ImageUpload,
  Image,
  CloudServices,
  EasyImage,
  Font,
  Alignment,
  Heading,
  ImageResize,
  Indent,
  Link,
  List,
  ListProperties,
  MediaEmbed,
  PageBreak,
  Paragraph,
  PasteFromOffice,
  Table,
  TableToolbar,
  TableProperties,
  TableCellProperties,
  TextTransformation,
  Underline,
  Strikethrough,
  SimpleUploadAdapter,
  Highlight,
]

// Editor configuration.
ClassicEditor.defaultConfig = {
  extraPlugins: [Snippet, ContentModal, PlaceholderBox],
  fontSize: {
    options: ['small', 'default'],
  },
  toolbar: {
    items: [
      'heading',
      '|',
      'bold',
      'italic',
      'underline',
      'strikethrough',
      'highlight',
      'link',
      'bulletedList',
      'numberedList',
      'fontFamily',
      'fontSize',
      '|',
      'alignment',
      'indent',
      'outdent',
      'pageBreak',
      '|',
      'blockQuote',
      'insertTable',
      'imageResize',
      'mediaEmbed',
      'undo',
      'redo',
      '|',
      'snippet',
      'placeholderBox',
    ],
  },
  list: {
    properties: {
      styles: true,
      startIndex: true,
      reversed: true,
    },
  },
  image: {
    toolbar: ['imageStyle:full', 'imageStyle:side', '|', 'imageTextAlternative'],
    resizeUnit: 'px',
  },
  table: {
    contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties'],
  },
  // This value must be kept in sync with the language defined in webpack.config.js.
  language: 'en',
}
