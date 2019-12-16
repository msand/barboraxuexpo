import * as works from './pages/works/[slug]';
import * as about from './pages/about';
import * as news from './pages/news';
import * as index from './pages';

export default {
  '/works/': works,
  '/about': about,
  '/news': news,
  '/': index,
};
