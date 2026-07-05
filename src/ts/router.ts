import { PagesList } from './base/enums';
import { isPlantsId } from './base/helpers';
import Cart from './components/cart';
import CartPage from './pages/cart-page';
import CatalogPage from './pages/catalog-page';
import ErrorPage from './pages/error-page';
import PlantPage from './pages/plant-page';

const BASE_PATH = '/ci-cd';

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

  static getAppPath(pathname: string) {
    return pathname.startsWith(BASE_PATH) ? pathname.slice(BASE_PATH.length) || '/' : pathname;
  }

  static getBrowserPath(pageId: string) {
    return `${BASE_PATH}${pageId}`;
  }

  static render(pathname: string) {
    const appPath = Router.getAppPath(pathname);

    switch (appPath) {
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
        if (isPlantsId(appPath)) {
          Router.plantPage.draw(appPath.slice(1));
        } else {
          Router.errorPage.draw();
        }

        break;
    }

    Router.changeLinks();
  }

  static goTo(pageId: string) {
    window.history.pushState({ pageId }, pageId, Router.getBrowserPath(pageId));
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
            const appPath = Router.getAppPath(new URL(link.href).pathname);
            const currentPath = Router.getAppPath(new URL(window.location.href).pathname);

            if (appPath !== currentPath) {
              Router.goTo(appPath);
            }
          }
        });

        link.classList.add('link-changed');
      }
    });
  }

  static startRouter() {
    window.addEventListener('popstate', () => {
      Router.render(new URL(window.location.href).pathname);
    });

    const page = new URL(window.location.href).pathname;
    Router.render(page);
  }
}

export default Router;
