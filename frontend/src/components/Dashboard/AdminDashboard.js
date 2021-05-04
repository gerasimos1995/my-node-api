import {
  DashboardContainer,
  DashboardWrapper,
  DashboardItem,
  ItemIcon,
  ItemH1,
} from "./DashboardElements";
import UsersLogo from "../../images/social_user.svg";
import OrdersLogo from "../../images/order_delivered.svg";
import ProductsLogo from "../../images/product_iteration.svg";
import PromotionLogo from "../../images/promotion.svg";
import MonitoringLogo from "../../images/monitoring.svg";
import ReviewsLogo from "../../images/reviews.svg";
const AdminDashboard = () => {
  return (
    <>
      <DashboardContainer>
        <DashboardWrapper>
          <DashboardItem>
            <ItemH1>Users</ItemH1>
            <ItemIcon src={UsersLogo} />
          </DashboardItem>
          <DashboardItem>
            <ItemH1>Orders</ItemH1>
            <ItemIcon src={OrdersLogo} />
          </DashboardItem>
          <DashboardItem>
            <ItemH1>Products</ItemH1>
            <ItemIcon src={ProductsLogo} />
          </DashboardItem>
          <DashboardItem>
            <ItemH1>Reviews</ItemH1>
            <ItemIcon src={ReviewsLogo} />
          </DashboardItem>
          <DashboardItem>
            <ItemH1>Monitoring</ItemH1>
            <ItemIcon src={MonitoringLogo} />
          </DashboardItem>
          <DashboardItem>
            <ItemH1>Promotion</ItemH1>
            <ItemIcon src={PromotionLogo} />
          </DashboardItem>
        </DashboardWrapper>
      </DashboardContainer>
    </>
  );
};

export default AdminDashboard;
