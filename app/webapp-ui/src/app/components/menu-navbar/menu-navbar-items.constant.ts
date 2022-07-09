import { MenuItem, PrimeIcons } from 'primeng/api';
import { AppRouteConstant } from '../../common/app-route.constant';

export const MenuNavbarItems: MenuItem[] = [
  {
    label: 'Mlemscan Dashboard',
    icon: PrimeIcons.TH_LARGE,
    routerLink: [`/${AppRouteConstant.MLEMSCAN}`]
  }, {
    label: 'Wallet Management',
    icon: PrimeIcons.WALLET,
    routerLink: [`/${AppRouteConstant.WALLET_MANAGEMENT}`]
  }, {
    label: 'About',
    icon: PrimeIcons.INFO_CIRCLE,
    routerLink: [`/${AppRouteConstant.ABOUT}`]
  }
];
