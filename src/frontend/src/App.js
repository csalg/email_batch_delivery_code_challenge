import './App.scss';
import React from "react";

import 'antd/dist/antd.css';
import {Alert, Button, Form, Input, Select, Steps} from 'antd';
import {
    CloudTwoTone,
    FileTextOutlined,
    InfoCircleOutlined,
    MailTwoTone,
    SendOutlined,
    UsergroupAddOutlined
} from '@ant-design/icons';
import TextArea from "antd/es/input/TextArea";
import {post} from "./services";
import {API_ENDPOINT} from "./environment";

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
            Body: "",
            error: ""
        };
        this.nextStep = this.nextStep.bind(this);
    }


    async nextStep(values) {

        if (values) {
            for (const [key, value] of Object.entries(values)) {
                console.log(key, value)
                await this.setStateAsync({[key]: value})
            }
        }
        if (this.state.currentStep === 2) {
            const payload = {
                'sender': this.state.Sender,
                'recipients': this.state.Recipients.split('\n'),
                'subject': this.state.Subject,
                'body': this.state.Body
            }
            console.log(payload)
            post(API_ENDPOINT, payload)
                .then(_ => {
                    this.setState({
                        currentStep: this.state.currentStep + 1
                    })
                })
                .catch(error => {
                    if (error.response) {
                        console.log(error.response)
                        this.setStateAsync({error: error.response.data.message})
                    }
                    console.log(error)
                });
        } else {
            this.setState({
                currentStep: this.state.currentStep + 1
            })
        }
    }

    setStateAsync(state) {
        return new Promise((resolve) => {
            this.setState(state, resolve)
        });
    }

    render() {

        const Step = this.steps[this.state.currentStep]

        return (
            <div className="page">
                <div className="flex flex-column wrapper ">
                    <Progress currentStep={this.state.currentStep}/>
                    <main className={'flex flex-column'}>
                        <Step nextStep={this.nextStep} error={this.state.error}/>
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
                    name="Body"
                    label="Body"
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

const Recipients = ({nextStep, error}) => {

    const verifiedAddresses = [
        "verified@domain.com",
        "also.verified@domain.com"
    ]

    const Error = _ => {
        if (error) {
            return (
                <div style={{marginBottom: '1em'}}>
                    <Alert type='error' message={error} showicon/>
                </div>
            )
        }
        return <span/>
    }

    return (
        <Form {...formLayout} style={{display: 'flex', flexGrow: 1}} onFinish={nextStep}>
            <div className="card flex flex-column">
                <div>
                    <Form.Item
                        name="Sender"
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
                        name="Recipients"
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
                <Error/>

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
