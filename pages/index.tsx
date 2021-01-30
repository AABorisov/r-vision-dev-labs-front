import {Typography} from "antd"
import Wrapper from '../components/Wrapper';
import Filters from "../components/Filters/Filters";
import Recognized from "../components/Tables/Recognized/Recognized";
import Uploaded from "../components/Tables/Uploaded/Uploaded";
import recognized from "../mocks/recognized"
import uploaded from "../mocks/uploaded"

const {Title} = Typography;

const Home: React.FC = () => {
  return (
    <Wrapper>
      <Title>Dashboard</Title>
      <Filters/>
      <Recognized data={recognized}/>
      <Uploaded data={uploaded}/>
    </Wrapper>
  )
}

export default Home;
