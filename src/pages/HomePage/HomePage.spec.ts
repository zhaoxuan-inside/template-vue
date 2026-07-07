import { mount } from '@vue/test-utils'
import HomePage from './HomePage.vue'

describe('HomePage', () => {
  it('renders GitHub URL correctly', () => {
    const wrapper = mount(HomePage)
    expect(wrapper.text()).toContain('https://github.com/zhaoxuan-inside')
    expect(wrapper.text()).toContain('zhaoxuan-inside')
  })

  it('renders visitor count', () => {
    const wrapper = mount(HomePage)
    expect(wrapper.text()).toContain('访客数')
  })

  it('increments visitor count on button click', async () => {
    const wrapper = mount(HomePage)
    const initialCount = wrapper.find('.text-3xl.font-bold.text-slate-800').text()
    await wrapper.find('button').trigger('click')
    const newCount = wrapper.find('.text-3xl.font-bold.text-slate-800').text()
    expect(parseInt(newCount)).toBe(parseInt(initialCount) + 1)
  })

  it('contains technology stack information', () => {
    const wrapper = mount(HomePage)
    expect(wrapper.text()).toContain('Vue 3')
    expect(wrapper.text()).toContain('FSD')
  })
})
