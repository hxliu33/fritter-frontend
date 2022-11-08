<!-- Form for switching fonts (dropdown) -->

<script>
import Dropdown from '@/components/common/Dropdown.vue';

export default {
  name: 'FontSwitchForm',
  mixins: [Dropdown],
  data() {
    return {
      title: 'Switch your current font',
      hasBody: true,
      url: '/api/font/current',
      choices: [
        {id: 'arial', value: 'Arial'},
        {id: 'cambria', value: 'Cambria'},
        {id: 'courier-new', value: 'Courier New'},
        {id: 'georgia', value: 'Georgia'},
        {id: 'gill-sans', value: 'Gill Sans'},
        {id: 'impact', value: 'Impact'},
        {id: 'lucida-sans', value: 'Lucida Sans'},
        {id: 'times-new-roman', value: 'Times New Roman'},
        {id: 'trebuchet-ms', value: 'Trebuchet MS'},
        {id: 'verdana', value: 'Verdana'},
      ],
      current: this.$store.state.font.value,
      purpose: 'fonts',
      callback: () => {
        this.$store.commit('alert', {
          message: 'Your font has been switched!', status: 'success'
        });
      }
    };
  }
};
</script>