import { Collapse } from 'antd';
import styled from 'styled-components';

export default styled(Collapse)`
border: 0px;
.ant-collapse-item{
    border: 0px;
    border-radius: 5px;
    background-color: #1890ff;
    background: #1890ff;

}
.ant-collapse-header{
    color: rgb(240 255 250) !important;
    padding: 6px 16px !important;
    padding-left: 30px !important;
}
.ant-collapse-arrow{
    padding: 6px 16px !important;
    padding-right: 0 !important;
    padding-bottom: 0 !important;
    padding-left: 0 !important;
}
.ant-collapse-content{
    background-color: #767e90;
    color: white;
    border-top: 0px;
}
`;
