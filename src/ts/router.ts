import { PagesList } from './base/enums';
import { isPlantsId } from './base/helpers';
import Cart from './components/cart';
import CartPage from './pages/cart-page';
import CatalogPage from './pages/catalog-page';
import ErrorPage from './pages/error-page';
import PlantPage from './pages/plant-page';

class Router {
  static catalogPage: CatalogPage;
  static cartPage: CartPage;
  static plantPage: PlantPage;
  static errorPage: ErrorPage;

  constructor(cart: Cart) {
    Router.catalogPage = new CatalogPage(cart);
    Router.cartPage = new CartPage(cart);
    Router.plantPage = new PlantPage(cart);
    Router.errorPage = new ErrorPage(cart);
  }

  static getHashPath() {
    const hash = window.location.hash.replace('#', '');

    return hash || PagesList.catalogPage;
  }

  static render(pathname: string) {
    const path = pathname.split('?')[0];

    switch (path) {
      case PagesList.catalogPage:
        Router.catalogPage.draw();
        break;

      case PagesList.cartPage:
        Router.cartPage.draw();
        break;

      case '/':
        Router.goTo(PagesList.catalogPage);
        break;

      default:
        if (isPlantsId(path)) {
          Router.plantPage.draw(path.slice(1));
        } else {
          Router.errorPage.draw();
        }

        break;
    }

    Router.changeLinks();
  }

  static goTo(pageId: string) {
    window.location.hash = pageId;
    Router.render(pageId);
    window.scrollTo(0, 0);
  }

  static changeLinks() {
    const links = document.querySelectorAll('[href^="/"]');

    links.forEach((link) => {
      if (!link.classList.contains('link-changed')) {
        link.addEventListener('click', (e) => {
          e.preventDefault();

          if (link instanceof HTMLAnchorElement) {
            const url = new URL(link.href);
            const nextPage = `${url.pathname}${url.search}`;

            Router.goTo(nextPage);
          }
        });

        link.classList.add('link-changed');
      }
    });
  }

  static startRouter() {
    if (!window.location.hash) {
      window.location.hash = PagesList.catalogPage;
    }

    window.addEventListener('hashchange', () => {
      Router.render(Router.getHashPath());
    });

    Router.render(Router.getHashPath());
  }
}

export default Router;
