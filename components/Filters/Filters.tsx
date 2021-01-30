import { Select, Typography, Col, Row } from "antd";
import Card from "../Cards/Card";
const { Title } = Typography;

const Filters: React.FC = ({ children }) => {
  const filterTitles = ['Malware', 'Software', 'Identity', 'Threat_actor', 'Campaign', 'Industry'];
  const filters = filterTitles.map((filterTitle) => {
    return {
      title: filterTitle,
      value: 0,
      options: [0, 1, 2, 3].map((i) => ({
        label: `${filterTitle} #${ i }`,
          value: i
      }))
    };
  });
  const handleChange = (filterTitle: string) => (value: string|number) => {
    console.log(`${filterTitle}: ${value}`)
  }
  return (
      <Card title="Filters">
        <Row gutter={[20, 20]}>
        { filters.map((filter) => {
          return (
            <Col key={filter.title} >
              <Title level={4}>{filter.title}</Title>
              <Select
                style={{ width: '200px' }}
                placeholder="All"
                onChange={handleChange}
                options={filter.options}
              />
            </Col>
          );
        })
        }
        </Row>
        { children }
      </Card>
  )
}

export default Filters;
