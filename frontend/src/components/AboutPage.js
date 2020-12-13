import {Wrapper, Button} from './style';
import colors from '../colors';
import TopBar from './TopBar';
import styled from 'styled-components';
import {navigate} from '@reach/router';

const Content = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  flex: 1;
`;
const Container = styled.div`
  display: flex;
  border: 4px solid ${colors.purple3};
  background-color: rgba(255, 255, 255, 0.75);
  justify-content: center;
  align-items: center;
  padding: 80px 0px;
`;
const Column = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 80%;
  margin: 20px;
`;
const PersonColumn = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  margin-right: 20px;
`;
const Role = styled.h3`
  font-family: Sniglet;
  font-style: normal;
  font-weight: normal;
  font-size: 32px;
  line-height: 40px;
  text-decoration-line: underline;
  margin: 0px;
`;
const PersonName = styled.h3`
  font-family: Sniglet;
  font-style: normal;
  font-weight: normal;
  font-size: 25px;
  margin: 0px;
`;

const RoleColumn = ({role, people}) => {
  return (
    <Column>
      <PersonColumn>
        <Role>{role}</Role>
        {people.map((person) => {
          return <PersonName>{person}</PersonName>;
        })}
      </PersonColumn>
    </Column>
  );
};

const BackButton = styled(Button)`
  font-size: 20px;
  margin: 10px;
  height: 30px;
  width: 5%;
`;

const AboutPage = () => {
  return (
    <Wrapper style={{justifyContent: 'flex-start'}}>
      <TopBar text={'About'} />
      <BackButton onClick={() => navigate('/')}>Back</BackButton>
      <Content>
        <Container>
          <RoleColumn role={'Product Manager'} people={['Jenny Fang']} />
          <RoleColumn
            role={'Engineers'}
            people={['Adrian Sanchez', 'Herrick Fang', 'Philip Zhang', 'Shiv Seetharaman']}
          />
          <RoleColumn
            role={'Designers'}
            people={['Chris Lee', 'Meera Bhandare', 'Isabelle Hung']}
          />
        </Container>
      </Content>
    </Wrapper>
  );
};

export default AboutPage;
