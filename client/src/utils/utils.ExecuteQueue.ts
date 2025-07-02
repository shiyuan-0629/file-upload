import { v4 as uuid } from 'uuid';

type execute = (item: any, onSUccess: () => void, onError: () => void) => void

type options = {
    perCount?: number,
    execute: execute,
    isAutoStart?: boolean
}


type format = {
    data: any,
    status: 'wait' | 'loading' | 'success' | 'error',
    key: string,
}


class ExecuteQueue {
    queue: any[] = []
    executingQueue: any[] = []
    perCount: number = 6
    execute: execute = () => { }
    finishedQueue: any[] = []
    isAutoStart: boolean = true

    constructor(options: options) {
        const { perCount, execute, isAutoStart } = options
        if (perCount !== undefined) {
            this.perCount = perCount;
        }
        if (!execute) {
            console.error('请初始化消费函数')
            return
        } else {
            this.execute = execute
        }
        if (isAutoStart !== undefined) {
            this.isAutoStart = isAutoStart;
        }
    }

    pushTasks(items: any[]) {
        const formattedItems = items.map(item => this.formatTask(item))
        this.queue = [...formattedItems, ...this.queue]
        if (this.isAutoStart) {
            this.fillExecuteQueue()
        }
    }

    _run() {
        this.fillExecuteQueue()
    }

    private fillExecuteQueue() {
        if (this.executingQueue.length < this.perCount) {
            for (let i = this.executingQueue.length; i < this.perCount; i++) {
                if (this.queue.length) {
                    const task = this.queue.shift()
                    this.executingQueue.push(task)
                } else break
            }
        }
        this.executeTask()
    }

    private executeTask() {
        this.executingQueue.forEach((item, index) => {
            if (item.status === 'wait') {
                item.status = 'loading'
                this.execute(
                    item.data,
                    () => this.onSuccess(item.key),
                    () => this.onError(item.key)
                )
            }
        })
    }

    private formatTask(item: any): format {
        return {
            data: item,
            status: 'wait',
            key: uuid(),
        }
    }

    private onSuccess(key: string) {
        const item = this.executingQueue.find((item) => item.key === key)
        item.status = 'success'
        this.finishedQueue.push(item)
        this.executingQueue = this.executingQueue.filter((item) => item.key !== key)
        if (this.queue.length) {
            this.fillExecuteQueue()
        } else if (!this.executingQueue.length) {
            console.log('所有任务均已处理完毕，处理结果：', this.finishedQueue)
        }
    }

    private onError(key: string) {
        const item = this.executingQueue.find((item) => item.key === key)
        item.status = 'error'
        this.finishedQueue.push(item)
        this.executingQueue = this.executingQueue.filter((item) => item.key !== key)
        if (this.queue.length) {
            this.fillExecuteQueue()
        } else if (!this.executingQueue.length) {
            console.log('所有任务均已处理完毕，处理结果：', this.finishedQueue)
        }
    }
}

export default ExecuteQueue