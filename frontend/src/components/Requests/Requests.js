import React from 'react';
import { Row, Col, Radio } from 'antd';
import RequestCard from '../../components/RequestCard';
import RequestForm from '../../components/RequestForm';
import RequestDetails from '../../components/RequestDetails';
import styles from './styles.module.scss';
import Loading from '../Loading/Loading';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class Requests extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      request: null,
      status: 'ACTIVE',
    };

    this.showModal = this.showModal.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  onCancel() {
    this.setState({
      showModal: false,
      request: null,
    });
  }

  showModal(request, modal) {
    this.setState({
      showModal: modal,
      request,
    });
  }

  statusChanged() {
    let status = 'ACTIVE';
    if (this.state.status === 'ACTIVE') {
      status = 'INACTIVE';
    }
    this.setState({ status });
  }

  renderRequests() {
    if (this.props.loading) {
      return <Loading />;
    }

    const requests = (this.state.status === 'ACTIVE' ? this.props.activeRequests : this.props.inactiveRequests);
    if (requests.length === 0) {
      const status = this.state.status === 'ACTIVE' ? 'ativa' : 'inativa';
      return (
        <div className={styles.emptyWrapper}>
          <p className={styles.emptyText}>Não há nenhuma solicitação {status}!</p>
        </div>
      );
    }

    return (
      requests.map((request) => {
        if (request.status !== this.state.status) {
          return null;
        }
        return (
          <div className={styles.requestWrapper} key={request.id}>
            <RequestCard
              request={request}
              isOrganization={this.props.isOrganization}
              onClick={() => this.showModal(request, this.props.isOrganization ? 'editForm' : 'details')}
            />
          </div>
        );
      }));
  }

  render() {
    return (
      <div className={styles.requests}>
        <Row>
          <Col span={20} offset={2}>
            <h2 className={styles.containerTitle}>
              <span>SOLICITAÇÕES RECENTES</span>
            </h2>
          </Col>
        </Row>
        <Row>
          <Col
            lg={{ span: 14, offset: 5 }}
            md={{ span: 20, offset: 2 }}
            sm={{ span: 20, offset: 2 }}
            xs={{ span: 22, offset: 1 }}
            className={styles.row}
          >
            {this.props.isOrganization &&
              <div className={styles.actionWrapper}>
                <RadioGroup defaultValue="ACTIVE" onChange={() => this.statusChanged()}>
                  <RadioButton value="ACTIVE">ATIVAS</RadioButton>
                  <RadioButton value="INACTIVE">INATIVAS</RadioButton>
                </RadioGroup>
                <button
                  className={styles.newButton}
                  onClick={() => this.showModal(null, 'editForm')}
                >
                  NOVA SOLICITAÇÃO
                </button>
              </div>
            }
            {this.renderRequests()}
            {this.props.isOrganization &&
              <RequestForm
                visible={this.state.showModal === 'editForm'}
                onCancel={() => this.onCancel()}
                request={this.state.request}
              />
            }
            {!this.props.isOrganization &&
              <RequestDetails
                visible={this.state.showModal === 'details'}
                onCancel={() => this.onCancel()}
                request={this.state.request}
              />
            }
          </Col>
        </Row>
      </div>
    );
  }
}

export default Requests;
