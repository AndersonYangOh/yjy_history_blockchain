# yjy_history_blockchain
基于以太坊的研究院大事迹系统
## 使用说明
该部分是去快链大事记的web应用部分，采用web3接口访问以太坊去快链系统实现事件的查看和新增。
js/index.js	通过web3与以太坊交互的方法，包括检出事件、新增事件。
main.css	主要的界面风格标签。
init.html	用于创建最基本的事件列表，并写入以太坊。
index.html	主界面，按时间顺序显示事件列表，并可以增加新的事件，背后同步入去快链。
test.html	用于测试区块链系统和合约的连通性。
## 实现功能
在web端连接以太坊系统，访问UnicomHistory.sol合约，实现数据萃取和数据新增。
### 事件列表页：
![image](https://github.com/ChinaUnicomRI/yjy_history_blockchain/blob/master/img/1.jpg)
### 事件添加：
![image](https://github.com/ChinaUnicomRI/yjy_history_blockchain/blob/master/img/2.jpg)
### 区块链中的交易：
![image](https://github.com/ChinaUnicomRI/yjy_history_blockchain/blob/master/img/3.jpg)
