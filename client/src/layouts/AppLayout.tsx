import { Outlet, useNavigation } from "react-router-dom";
// import { Footer } from "./Footer";
import { Header } from "./Header";

export const AppLayout = () => {
  const Navigation = useNavigation();
  console.log(Navigation);

  // if(Navigation.state == "loading") return <h1>Loading............</h1>
  if (Navigation.state == "loading") return <h1>Loading...</h1>;

  return (
    <>
      <Header />
      <Outlet />
      {/* <Footer /> */}
    </>
  );
};
