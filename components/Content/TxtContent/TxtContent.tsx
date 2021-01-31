import Card from "../../Cards/Card";

import txtdoc from "../../../mocks/txtdoc";


const TxtContent = () => {


  return (
    <Card title={'Text'}>
      <div>
        {txtdoc}
      </div>
    </Card>
  )
}

export default TxtContent;
