import {Button, Result, Layout} from "antd";
import {Link} from "react-router-dom";
import React from "react";

const { Content } = Layout;

export const NotFoundPage = () => {
    return (
        <Content style={{paddingTop: '64px'}}>
            <Result
                status="404"
                title="404"
                subTitle="Такой страницы нет =("
                extra={<Button type="primary"><Link to="/">Домой</Link></Button>}
            />
        </Content>
    )
}