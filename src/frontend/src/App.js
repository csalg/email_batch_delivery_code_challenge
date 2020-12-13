import './App.scss';
import React from "react";

import 'antd/dist/antd.css';
import {Button, Form, Input, Select, Steps} from 'antd';
import {
    CloudTwoTone,
    FileTextOutlined,
    InfoCircleOutlined,
    MailTwoTone,
    SendOutlined,
    UsergroupAddOutlined
} from '@ant-design/icons';
import TextArea from "antd/es/input/TextArea";

const {Step} = Steps;
const {Option} = Select;

export default class extends React.Component {

    constructor(props) {
        super(props);

        this.steps = [Intro, Message, Recipients, Done]
        this.state = {
            currentStep: 0,
            Sender: "",
            Recipients: [],
            Subject: "",
            Body: ""
        };
        this.nextStep = this.nextStep.bind(this);
    }

    nextStep(values) {
        this.setState({
            currentStep: this.state.currentStep + 1
        })
        if (values) {
            for (const [key, value] of Object.entries(values)) {
                this.setState({[key]: value})
            }
        }
    }

    render() {

        const Step = this.steps[this.state.currentStep]

        return (
            <div className="page">
                <div className="flex flex-column wrapper ">
                    <Progress currentStep={this.state.currentStep}/>
                    <main className={'flex flex-column'}>
                        <Step nextStep={this.nextStep}/>
                    </main>
                </div>
            </div>
        )
    }
}

const Progress = ({currentStep}) => {
    console.log(currentStep)
    const status = (stepNumber) => {
        if (stepNumber < currentStep) return 'finish';
        if (stepNumber === currentStep) return 'process';
        return "wait";
    }
    return (

        <div className={'progress'}>
            <Steps style={{marginBottom: '2em'}}>
                <Step status={status(0)} title="Info" icon={<InfoCircleOutlined/>}/>
                <Step status={status(1)} title="Compose" icon={<FileTextOutlined/>}/>
                <Step status={status(2)} title="Addresses" icon={<UsergroupAddOutlined/>}/>
                <Step status={status(3)} title="Done" icon={<SendOutlined/>}/>
            </Steps>
        </div>
    )
};

const Intro = ({nextStep}) => (
    <div className={'card flex flex-column'}>
        <div className="card-with-figure flex">
            <figure>
                <MailTwoTone/>
            </figure>
            <div className={'card-content'}>
                <h2>Batch E-mail Delivery Tool</h2>
                <p>
                    Reach all of your customers with this mass e-mail delivery tool.
                    Simply write your message, and paste the list of recipients. We will take care of the rest.
                </p>

            </div>
        </div>
        <Form.Item {...nextButtonLayout}>
            <Button type="primary" onClick={_ => nextStep()}>
                Start
            </Button>
        </Form.Item>
    </div>
)


const Message = ({nextStep}) => (
    <Form {...formLayout} style={{display: 'flex', flexGrow: 1}} onFinish={nextStep}>
        <div className="card flex flex-column">
            <div>
                <Form.Item
                    name="Subject"
                    label="Subject"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input placeholder={''}/>

                </Form.Item>
                <Form.Item
                    name="Message"
                    label="Message"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <TextArea placeholder={''}/>
                </Form.Item>
            </div>
            <Form.Item {...nextButtonLayout}>
                <Button type="primary" htmlType="submit">
                    Next
                </Button>
            </Form.Item>
        </div>
    </Form>
)

const Recipients = ({nextStep}) => {

    const verifiedAddresses = [
        "verified@domain.com",
        "also.verified@domain.com"
    ]

    return (
        <Form {...formLayout} style={{display: 'flex', flexGrow: 1}} onFinish={nextStep}>
            <div className="card flex flex-column">
                <div>
                    <Form.Item
                        name="sender"
                        label="Sender"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Select
                            placeholder="Choose one of your verified addresses."
                            allowClear
                        >
                            {verifiedAddresses.map(address => <Option value={address}>{address}</Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="recipients"
                        label="Recipients"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <TextArea placeholder={'List of recipient addresses (one per line).'}/>
                    </Form.Item>
                </div>

                <Form.Item {...nextButtonLayout}>
                    <Button type="primary" htmlType="submit">
                        Next
                    </Button>
                </Form.Item>
            </div>
        </Form>
    );
}

const Done = _ => (
    <div className={'card flex flex-column'}>
        <div className="card-with-figure flex">
            <figure>
                <CloudTwoTone/>
            </figure>
            <div className={'card-content'}>
                <h2>Delivery in Progress</h2>
                <p>
                    Your e-mails are being sent as we speak!
                </p>
            </div>
        </div>
    </div>
)

const formLayout = {
    labelCol: {
        span: 4,
    },
    wrapperCol: {
        span: 20,
    },
};
const nextButtonLayout = {
    wrapperCol: {
        offset: 22,
        span: 2,
    },
};
