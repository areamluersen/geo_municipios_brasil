import { Modal, Descriptions } from 'antd';
import styled from 'styled-components';

export const StyledDesc = styled(Descriptions)`
.ant-descriptions-header {
    margin-bottom: 0;
}
.ant-descriptions-title {
    margin-bottom: 0;
    color: #40a3ff;

}
.ant-descriptions-view {
    margin-bottom: 10px;
}
.ant-descriptions-item-content {
    font-weight: 500;
    color: #1890ff;
}
.ant-descriptions-item-label {
    background-color: #494f54;
    color: whitesmoke;
    font-weight: 500;
}
`;

export const StyledModal = styled(Modal)`
.ant-modal-body {
    background: #07274485;
}
`;
