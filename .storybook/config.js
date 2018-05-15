import { configure } from '@storybook/react';

function loadStories() {
  require('../examples/stories/LightMachineStory.tsx');
}

configure(loadStories, module);
