import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { _Blog } from './Blog/Blog.stories';
import { _Details } from './Details/Details.stories';
import { _Policies } from './Policies/Policies.stories';
import { _Product } from './Product/Product.stories';
import ProductPage from './ProductPage';
import { _RelatedProducts } from './RelatedProducts/RelatedProducts.stories';
import { _Reviews } from './Reviews/Reviews.stories';

const Meta: ComponentMeta<typeof ProductPage> = {
  title: 'Features / Product Page',
  component: ProductPage,
  parameters: {
    layout: 'centered'
  },
  argTypes: {
    addToCart: {
      action: 'Add to Cart'
    }
  }
};

const Template: ComponentStory<typeof ProductPage> = (args) => <ProductPage {...args} />;

export const _ProductPage = Template.bind({});
_ProductPage.args = {
  ..._Product.args,
  ..._Details.args,
  ..._Policies.args,
  ..._Reviews.args,
  ..._RelatedProducts.args,
  ..._Blog.args
};

export default Meta;