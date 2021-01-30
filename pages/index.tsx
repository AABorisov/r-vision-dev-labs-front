import Wrapper from '../components/Wrapper';

import { Typography } from "antd"
import Filters from "../components/Filters/Filters";
import Recognized from "../components/Tables/Recognized";
import Uploaded from "../components/Tables/Uploaded";

const { Title } = Typography;

const Home: React.FC = () => {
  return (
    <Wrapper>
      <Title>Dashboard</Title>
      <Filters/>
      <Recognized />
      <Uploaded />
    </Wrapper>
  )
}

export default Home;
