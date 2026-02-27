import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default createVuetify({
  components,
  directives,

  // ЯВНО включаем светлую тему, чтобы нигде не подхватывался dark
  theme: {
    defaultTheme: 'light',
  },
})