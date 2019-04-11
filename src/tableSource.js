import filters from './filters'

export default class TableSource {
  dataSource = {
    content: [],
    pageable: {},
    sort: {}
  }

  loading = false
  responseTimeMs = 0

  pagination = {
    showSizeChanger: true,
    pageSize: 10,
    current: 1,
    total: 0
  }

  config = {
    api: null,
    params: {},
    generateIndex: true,
    formatCreateAt: true,
    onUpdateData: record => record,
    success: records => records,
    resFilter: records => records
  }

  constructor (userConfig = {}) {
    Object.assign(this.config, userConfig)
    Object.assign(this.pagination, userConfig.pagination)
    this.onTableChange = this.onTableChange.bind(this)
  }

  async loadData () {
    this.loading = true

    let sendDate = (new Date()).getTime();

    try {
      let res = await this.config.api({
        ...this.config.params,
        size: this.pagination.pageSize,
        page: this.pagination.current - 1
      })

      let receiveDate = (new Date()).getTime();

      this.responseTimeMs = receiveDate - sendDate;

      res = this.config.resFilter(res)

      this.dataSource = {
        ...res,
        content: res.content.map(this.config.onUpdateData)
      }

      this.pagination.total = res.totalElements

      if (this.config.generateIndex) {
        this.generateIndex()
      }

      if (this.config.formatCreateAt) {
        this.formatCreateAt()
      }

      this.config.success(res)
    } finally {
      this.loading = false
    }
  }

  onTableChange (pagination) {
    Object.assign(this.pagination, pagination)

    this.loadData()
  }

  formatCreateAt () {
    this.dataSource.content.forEach(value => {
      value._createAt = filters.datetime(value.createAt)
    })
    return this
  }

  setParams (params) {
    Object.assign(this.config.params, params)
  }

  generateIndex () {
    const fixedIndex = this.pagination.pageSize * (this.pagination.current - 1) + 1

    this.dataSource.content.forEach((value, index) => {
      value._index = index + fixedIndex
    })
    return this
  }

  get content () {
    return this.dataSource.content
  }
}