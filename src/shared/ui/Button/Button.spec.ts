import { mount } from '@vue/test-utils'
import Button from './Button.vue'

describe('Button', () => {
  it('renders correctly', () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'Click me',
      },
    })
    expect(wrapper.text()).toBe('Click me')
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('applies primary variant class', () => {
    const wrapper = mount(Button)
    expect(wrapper.find('button').classes()).toContain('bg-primary')
    expect(wrapper.find('button').classes()).toContain('text-white')
  })

  it('applies secondary variant class', () => {
    const wrapper = mount(Button, {
      props: {
        variant: 'secondary',
      },
    })
    expect(wrapper.find('button').classes()).toContain('bg-gray-100')
    expect(wrapper.find('button').classes()).toContain('text-gray-800')
  })

  it('applies danger variant class', () => {
    const wrapper = mount(Button, {
      props: {
        variant: 'danger',
      },
    })
    expect(wrapper.find('button').classes()).toContain('bg-danger')
    expect(wrapper.find('button').classes()).toContain('text-white')
  })

  it('applies size classes', () => {
    const smWrapper = mount(Button, { props: { size: 'sm' } })
    expect(smWrapper.find('button').classes()).toContain('text-sm')

    const lgWrapper = mount(Button, { props: { size: 'lg' } })
    expect(lgWrapper.find('button').classes()).toContain('text-lg')
  })

  it('applies disabled state', () => {
    const wrapper = mount(Button, {
      props: {
        disabled: true,
      },
    })
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
    expect(wrapper.find('button').classes()).toContain('opacity-50')
    expect(wrapper.find('button').classes()).toContain('cursor-not-allowed')
  })

  it('emits click event', async () => {
    const wrapper = mount(Button)
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted()).toHaveProperty('click')
  })
})
