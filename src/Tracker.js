import React, { Component } from 'react';
import {
  postTransaction,
  fetchWorkers,
  fetchTransactions
} from './state/actions';
import './App.css';
import { connect } from 'react-redux';
import { transaction } from './Transaction';
import moment from 'moment';

const initialState = {
  eggs: undefined,
  eggType: '',
  workerID: '',
  date: '',
  notes: ''
}


class Tracker extends Component {
  constructor(props) {
    super(props);
    this.state = initialState

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeType = this.handleChangeType.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    //this.handleWorkerSelect = this.handleWorkerSelect.bind(this);
    this.handleSubmitNote = this.handleSubmitNote.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDateInput = this.handleDateInput.bind(this);
  }

  componentWillMount() {
    //console.log(this.props)
    this.props.fetchWorkers()
    this.props.fetchTransactions()
    let rightNow = moment(Date.now()).format('YYYY-MM-DD')
    this.setState({date:rightNow})
  }
  handleChange(e) {
    this.setState({ eggs: parseInt(e.target.value) })
  }
  handleChangeType(e) {
    this.setState(initialState)
  }
  // handleWorkerSelect(e) {
  //   //console.log(`button clicked for ${e.target.value}`)
  //   let workerSelect = this.props.workers.find((obj) => { return e.target.value === obj.id })
  //   console.log("from handle worker select")
  //   //console.log(workerSelect)
  //   this.setState({ workerID: workerSelect.id })
  // }
  handleSubmitNote(e) {
    this.setState({ notes: (e.target.value) })
  }
  handleSubmit(e) {
    e.preventDefault();
    //console.log("from handle submit")
    let tempId = document.getElementById("formControlSelect3").value
    //console.log(tempId)
    let transDate = moment(this.state.date).format('X')
    this.props.postTransaction({ transType: 'Collect', typeId: tempId, eggCount: this.state.eggs, transactionDate: transDate, transactionNotes: this.state.notes })
    this.setState({ eggs: '', notes: ''})
  }
  handleDateInput(e) {
    this.setState({ date: (e.target.value) })
  }

  render() {
    let sortedList = this.props.transactions.sort((a, b) => { return (parseInt(a.transId) < parseInt(b.transId) ? 1 : (parseInt(b.transId) < parseInt(a.transId)) ? -1 : 0); });
    return (
      <div>
        {this.props.isLoading ?
          (
            <img alt="Loading..." src={require('./images/egg_loader.gif')} />
          ) :
          (
            <div>
              <form className="form-body col-sm-11">
                <div className="card trans-form-body border-primary">
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <label htmlFor="formControlSelect3">Worker</label>
                      <select className="form-control" id="formControlSelect3">
                        {this.props.workers.map((worker) => {
                          if (worker.workerType === "Layer") {
                            return (
                              <option key={worker.id} value={worker.id}>{worker.name}</option>
                            )
                          }
                        })
                        }
                      </select>
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="formControlSelect2">Transaction Type</label>
                      <select className="form-control" id="formControlSelect2">
                        <option>Add</option>
                        {/* <option>Remove</option> */}
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <label htmlFor="formControlSelect1">Type of Egg</label>
                      {/* <label id="labelControl1">{this.props.workers.type}</label> */}
                      <select className="form-control" id="formControlSelect1" onChange={this.handleChangeType}>
                        <option>Chicken</option>
                        <option>Duck</option>
                      </select>
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="formControlSelect4">Transaction Amount</label>
                      <input type="number" value={this.state.eggs} className="form-control" id="formControlSelect4"
                        onChange={this.handleChange}>
                      </input>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <label htmlFor="formDatePicker">Date</label>
                      <input type="date" className="form-control" id="formDatePicker" value={this.state.date} onChange={this.handleDateInput} placeholder="Choose Date" />
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="formTextArea1">Notes</label>
                      <textarea className="form-control" id="formTextArea1" rows="2" value={this.state.notes} onChange={this.handleSubmitNote}></textarea>
                    </div>
                  </div>
                </div>
                <div className="row">&nbsp;</div>
                <button type="button" className="btn btn-primary"
                  onClick={this.handleSubmit}
                >Submit</button>
                <div className="row">&nbsp;</div>
              </form>
              <div className="display-table card col-sm-11 text-blue border-primary trans-card-body">
                <table className="table table-striped table-bordered trans-outer-table">
                  <thead className="thead-dark">
                    <tr>
                      <th scope="col">Transaction ID</th>
                      <th scope="col">Egg Type</th>
                      <th scope="col">Transaction Type</th>
                      <th scope="col">Worker</th>
                      <th scope="col">Number of Eggs</th>
                      <th scope="col">Date Collected</th>
                      <th scope="col">Notes</th>
                    </tr>
                  </thead>
                  <tbody>                                       
                    {sortedList.map((transaction) => {
                      if (transaction.transType === "Collect") {
                        let worker = this.props.workers.find(obj => (transaction.typeId === obj.id))
                        let dspDate = moment(new Date(transaction.transactionDate * 1000)).format('MM/DD/YYYY')                                                
                        return (
                          <tr key={transaction.transId}>
                            <th scope="row">{transaction.transId}</th>
                            <td>{worker.type}</td>
                            <td>{transaction.transType}</td>
                            <td>{worker.name}</td>
                            <td>{transaction.eggCount}</td>
                            <td>{dspDate}</td>
                            <td>{transaction.transactionNotes}</td>
                          </tr>
                        )
                      }
                    }
                    )}
                  </tbody>
                </table>
              </div>
            </div>)
        }
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    workers: state.workers,
    transactions: state.transactions,
    isLoading: state.isLoading
  }
}

const mapDispatchToProps = dispatch => {
  return {
    postTransaction: eggs => {console.log(eggs);dispatch(postTransaction(eggs))},
    fetchWorkers: () => dispatch(fetchWorkers()),
    fetchTransactions: () => dispatch(fetchTransactions())
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Tracker);
